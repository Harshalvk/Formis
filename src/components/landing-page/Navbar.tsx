import { auth } from "@/auth";
import NavbarContent from "./NavbarContent";

const Navbar = async () => {
  const session = await auth();

  return <NavbarContent user={session?.user || {}} />;
};

export default Navbar;
