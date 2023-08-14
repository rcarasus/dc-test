import React from 'react';

const setAvatarPath = (e) => {
    localStorage.setItem('avatarPath', e);
}

const getAvatarPath = localStorage.getItem('avatarPath');
function delAvatarPath() { localStorage.removeItem('avatarPath') }

export {getAvatarPath, setAvatarPath, delAvatarPath}