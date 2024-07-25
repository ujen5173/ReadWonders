import Greetings from "./_components/greetings";

// make it client fetching...
// remove suspense and all shit
// authentication flow working fine, causes problem due to server rendered!!!

const Dashboard = () => {
  return (
    <>
      <Greetings />
      {/* <CurrentReads /> */}
      {/* <Suspense fallback={<LoadingRow />}> */}
      {/* <FeaturedAndLatest /> */}
      {/* </Suspense> */}
      {/* 
      <Suspense fallback={<LoadingRow />}>
        <Recommended />
      </Suspense> */}
      {/* <Suspense fallback={<LoadingRow />}> */}
      {/* <MostLoved /> */}
      {/* </Suspense> */}
      {/* <Suspense fallback={<LoadingRow />}> */}
      {/* <TopPicks /> */}
      {/* </Suspense> */}
    </>
  );
};

export default Dashboard;
