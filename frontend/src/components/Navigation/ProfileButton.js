import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user, setLogin, setShowModal }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button className='coolButton' onClick={openMenu}>
        <div className="bars">
        <i className="fa-solid fa-bars" />
        </div>
        <div className="profileFace">
        <i className="fas fa-user-circle fa-2x" />
        </div>
      </button>
      {showMenu && ( user ?
       ( <div className="profile-dropdownLogOut">
          <div className="userAndEmail">
          <div className="username">{user.username}</div>
          <div className="email">{user.email}</div>
          </div>
            <button className="hamButton2" onClick={logout}>Log Out</button>
        </div>) :
        <div className="profile-dropdown">
            <button className="hamButton1" onClick={() => {
              setLogin(true)
              setShowModal(true)
            }}>Log in</button>
            <button className="hamButton2" onClick={() => {
              setLogin(false)
              setShowModal(true)
            }}>Sign Up</button>
        </div>
      )}
    </>
  );
}

export default ProfileButton;