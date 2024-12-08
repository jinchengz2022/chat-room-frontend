export interface UserRegisterRequest {
  userName: string;
  password: string;
  captcha: string;
  email: string;
  headPic?: string;
  nickName?: string;
}

export interface GetCodeRequest {
    to: string;
    action: 'register' | 'updatePwd';
}

export interface AddFriendRequest {
  userName: string;
  reason?: string;
}
