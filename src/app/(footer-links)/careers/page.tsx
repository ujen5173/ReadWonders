const Careers = () => {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4">
        <div className="py-12">
          <h1 className="mb-6 text-center text-3xl font-semibold text-primary sm:text-4xl">
            Current Openings
          </h1>

          <p className="mx-auto w-full text-center md:w-7/12">
            We are always looking for talented individuals to join our team. If
            you are interested in working with us, please send your resume to{" "}
            <a
              href="mailto:ujenbasi1122@gmail.com"
              className="text-primary hover:underline"
            >
              ujenbasi1122@gmail.com
            </a>
          </p>
        </div>

        <div>
          <p className="text-center text-lg font-semibold text-primary">
            No current openings <br /> Email us your resume for future
            opportunities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Careers;
