import { Modal } from "@mantine/core";
import { SetStateAction, useState } from "react";

const RegisterModal = ({
    isOpenRegister,
    closeRegister
}: {
    isOpenRegister: boolean,
    closeRegister: ()=> void
})=>{
    return(
        <Modal size={"xl"} opened={isOpenRegister} onClose={closeRegister} withCloseButton={false}>
            <div className="w-full h-full relative" >
                <div>
                    <h1>Register</h1>
                    <h2>Provide your details to register your account.</h2>
                </div>
            </div>
        </Modal>
    )
}
export default RegisterModal;