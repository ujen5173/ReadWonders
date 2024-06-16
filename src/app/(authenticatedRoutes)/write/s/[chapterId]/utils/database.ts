import { toast } from "~/components/ui/use-toast";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ReadWondersDB", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("drafts")) {
        db.createObjectStore("drafts", { keyPath: "id" });
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject(
        `Error opening IndexedDB: ${(event.target as IDBOpenDBRequest).error}`,
      );
    };
  });
}

export type Draft = {
  id?: string;
  storyId: string;
  chapterId: string;
  content?: string;
  title?: string;
  cover_image?: {
    url: string;
    name: string;
  } | null;
};

interface AutosaveContentParams {
  draftKey: keyof Omit<Draft, "id">;
  value: string | Draft["cover_image"];
  storyId: string;
  chapterId: string;
}

export async function autosaveContent({
  draftKey,
  value,
  storyId,
  chapterId,
}: AutosaveContentParams): Promise<void> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(["drafts"], "readwrite");
    const store = transaction.objectStore("drafts");
    const id = `${storyId}_${chapterId}`;

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const draft: Draft = getRequest.result || { id };

      // Update the specific field with type assertion
      (draft[draftKey] as typeof value) = value;

      // Save the updated draft back to the database
      store.put(draft);

      transaction.oncomplete = () => {
        // "Draft saved successfully"
      };

      transaction.onerror = () => {
        // `Error saving draft: ${(event.target as IDBRequest).error}`
      };
    };

    getRequest.onerror = () => {
      // `Error retrieving draft: ${(event.target as IDBRequest).error}`
    };
  } catch (error) {
    toast({
      title: `Unexpected error`,
    });
  }
}

export async function syncToDatabase(): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(["drafts"], "readonly");
  const store = transaction.objectStore("drafts");
  const request = store.getAll();

  request.onsuccess = async (event: Event) => {
    const drafts: Draft[] = (event.target as IDBRequest).result;

    for (const draft of drafts) {
      await saveDraftToDatabase(draft);
    }
  };

  request.onerror = (event: Event) => {
    console.error(
      `Error reading drafts: ${(event.target as IDBRequest).error}`,
    );
  };
}

async function saveDraftToDatabase(draft: Draft): Promise<void> {
  // Implement API call to save draft content to the database
  console.log("Syncing draft to database:", draft);
  // Example API call
  // await fetch('/api/saveDraft', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(draft),
  // });
}

// Call this function periodically or on specific triggers
// setInterval(syncToDatabase, 300000); // Every 5 minutes

export async function loadDraft(
  storyId: string,
  chapterId: string,
): Promise<Draft | undefined> {
  const db = await openDatabase();
  const transaction = db.transaction(["drafts"], "readonly");
  const store = transaction.objectStore("drafts");
  const request = store.get(`${storyId}_${chapterId}`);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event: Event) => {
      const draft: Draft | undefined = (event.target as IDBRequest).result;

      if (draft) {
        resolve(draft);
      } else {
        reject("Draft not found!");
      }
    };

    request.onerror = (event: Event) => {
      console.error(
        `Error loading draft: ${(event.target as IDBRequest).error}`,
      );
      reject(`Error loading draft: ${(event.target as IDBRequest).error}`);
    };
  });
}
