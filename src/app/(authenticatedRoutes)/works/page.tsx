"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const Works = () => {
  const { data, isLoading } = api.story.work.useQuery();

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1>My Stories</h1>
        <Button>New Story</Button>
      </div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {data?.map((story) => (
              <div key={story.id}>
                <h2>{story.title}</h2>
                <p>{story.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Works;
