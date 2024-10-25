"use client";

import { MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import styles from "./MobileDrawer.module.css";
import LogoLink from "./LogoLink";

import NavLink from "./NavLink";
import LogoutButtonItem from "./LogoutButtonItem";
import { doctorLinks, patientLinks } from "./NavLinks";
import { ExtendedUser } from "@/next-auth";
import { useDrawerStore } from "@/store/drawerStore";
import Avatar from "../Avatar";

function MobileDrawer({
  user,
}: {
  user: ExtendedUser | undefined;
}) {
  const { isDrawerOpen, closeDrawer } = useDrawerStore();

  const loggedInLinks =
    user?.role === "DOCTOR" ? doctorLinks : patientLinks;

  return (
    <div
      className={`bg-bgLight ${styles.drawer} ${
        isDrawerOpen
          ? styles.drawerOpen
          : styles.drawerClosed
      }`}
    >
      <div
        className={`${styles.drawerHeader} py-mobileY px-mobileX`}
      >
        <LogoLink />
        <button
          className={`${styles.closeButton} text-dark-hover`}
          onClick={closeDrawer}
          aria-label="Close Menu"
        >
          <MdOutlineClose size={28} />
        </button>
      </div>

      {user ? (
        <div className={styles.navUser}>
          <Link href="/" className={styles.navUserLink}>
            <Avatar
              user={user}
              width={55}
              height={55}
              className="mr-3"
            />

            <div className={styles.userInfo}>
              <span className="text-lg text">
                {user.name}
              </span>
              <span className="text-sm text-textLight">
                {user.doctor?.specialization || user.role}
              </span>
            </div>
          </Link>
        </div>
      ) : (
        <>
          <ul className={styles.navList}>
            <NavLink
              link="/auth/login"
              label="Login"
              className={styles.navItem}
              onClick={closeDrawer}
            />
            <NavLink
              link="/auth/register"
              label="Signup"
              className={styles.navItem}
              onClick={closeDrawer}
            />
          </ul>
          <hr className={styles.separator} />
        </>
      )}

      <div className="text-textGray">
        {user && (
          <ul className={styles.navList}>
            {loggedInLinks.map((link) => (
              <NavLink
                key={link.label}
                link={link.href}
                label={link.label}
                className={styles.navItem}
                onClick={closeDrawer}
              />
            ))}
            <LogoutButtonItem
              className={styles.navItem}
              onClick={closeDrawer}
            />
          </ul>
        )}

        <hr className={styles.separator} />

        {/* APP nav */}
        <ul className={styles.navList}>
          <NavLink
            link="/"
            label="Home"
            className={styles.navItem}
            onClick={closeDrawer}
          />
          <NavLink
            link="/search"
            label="Find a Doctor"
            className={styles.navItem}
            onClick={closeDrawer}
          />
          <NavLink
            link="/search"
            label="Find a Dentist"
            className={styles.navItem}
            onClick={closeDrawer}
          />
        </ul>

        <hr className={styles.separator} />

        <ul className={styles.navList}>
          <NavLink
            link="/"
            label="Invite Friends"
            className={styles.navItem}
            onClick={closeDrawer}
          />
          <NavLink
            link="/"
            label="Help and Support"
            className={styles.navItem}
            onClick={closeDrawer}
          />
        </ul>
      </div>
    </div>
  );
}

export default MobileDrawer;
