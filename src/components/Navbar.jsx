import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

function Navbar({ currentUser }) {
  return (
    <Flex
      className="navbar"
      align={"center"}
      justify={"space-between"}
      fontWeight={"bold"}
      p={"30px"}
      position={"fixed"}
      top={"0px"}
      w={"100%"}>
      <Text>Home</Text>
      <Flex gap={"10px"} align={"center"}>
        <Text>
          {currentUser.displayName ? currentUser.displayName : "User"}
        </Text>
        <Image
          w={"35px"}
          h={"35px"}
          borderRadius={"50%"}
          src={currentUser.photoURL ? currentUser.photoURL : "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"}
          referrerPolicy="no-referrer"
          alt="profile-picture"
        />
      </Flex>
    </Flex>
  );
}

export default Navbar;
