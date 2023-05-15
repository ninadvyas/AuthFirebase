import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

function Login() {
  const [loading, setLoading] = useState(false);
  const otpRef = useRef();
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { signInWithGoogle, currentUser, setCurrentUser } = UserAuth();

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  const CaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignIn();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  };

  const onSignIn = () => {
    setLoading(true);
    CaptchaVerify();

    const verifier = window.recaptchaVerifier;
    const number = "+" + phone;

    signInWithPhoneNumber(auth, number, verifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast({
          title: `OTP sent successfully!`,
          status: "success",
          isClosable: true,
          position: "top",
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onRecieveOTP = () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otpRef.current.value)
      .then(async (response) => {
        await setCurrentUser(response.user);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (currentUser) {
      return navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <Center className="login" w={"100%"} h={"100dvh"} px={"10px"}>
      <Flex flexDir={"column"} maxW={"max-content"} w={"100%"}>
        <Box id="recaptcha-container"></Box>
        {showOTP ? (
          <Flex
            gap={"10px"}
            flexDir={"column"}
            align={"center"}
            className="otp-container"
            textAlign={"center"}>
            <Text fontSize={"lg"}>Enter the OTP</Text>
            <Input ref={otpRef} autoFocus textAlign="center" type="number" />
            <Button
              onClick={onRecieveOTP}
              isLoading={loading}
              colorScheme="blue"
              mt={"10px"}>
              Verify OTP
            </Button>
          </Flex>
        ) : (
          <Flex
            gap={"10px"}
            flexDir={"column"}
            align={"center"}
            className="phone-container"
            textAlign={"center"}>
            <Text fontSize={"lg"}>Sign in with phone number</Text>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              country={"in"}
              className="phone-input"
            />
            <Button
              isLoading={loading}
              onClick={onSignIn}
              colorScheme="blue"
              mt={"10px"}>
              Recieve OTP
            </Button>
          </Flex>
        )}
        <Flex my={"25px"} align={"center"} px={"10%"}>
          <Divider />
          <Text px={"15px"}>OR</Text>
          <Divider />
        </Flex>
        <button
          onClick={handleSignInWithGoogle}
          type="button"
          className="google-sign-in-button">
          Sign in with Google
        </button>
      </Flex>
    </Center>
  );
}

export default Login;
