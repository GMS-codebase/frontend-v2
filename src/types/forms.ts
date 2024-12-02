export interface SignUpForm {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  gender: string;
  institution: string;
  position: string;
}
export interface LogInForm {
  email: string;
  password: string;
}

export interface SetPasswordForm {
  confirmpassword: string;
  password: string;
}


