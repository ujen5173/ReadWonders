import { redirect } from "next/navigation";

const IndexPage = () => {
  redirect("/settings/profile");
};

export default IndexPage;
