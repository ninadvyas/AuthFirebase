import { Button, Center, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Home() {
  const [loading, setLoading] = useState(false);
  const { currentUser, logOutUser } = UserAuth();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logOutUser();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Center
      px={"10px"}
      textAlign={"center"}
      flexDir={"column"}
      gap={"20px"}
      className="home"
      w={"100%"}
      h={"100dvh"}>
      <Navbar currentUser={currentUser} />
      <Text fontSize={"4xl"}>
        Welcome back,{" "}
        <span style={{ fontWeight: "bold" }}>
          {currentUser.displayName ? currentUser.displayName : "User"}
        </span>
      </Text>
      {currentUser && (
        <Button
          isLoading={loading}
          onClick={handleLogout}
          colorScheme="red"
          variant={"outline"}>
          Logout
        </Button>
      )}
    </Center>
  );
}

export default Home;
