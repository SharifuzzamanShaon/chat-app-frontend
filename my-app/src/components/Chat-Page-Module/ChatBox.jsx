import { Box } from '@chakra-ui/react'
import React from 'react'
import { useGlobalContext } from '../../context/ChatProvider'
import SingleChat from '../utils/SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, userInfo } = useGlobalContext();
  return (
    <Box d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px">
      <SingleChat userInfo={userInfo} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} ></SingleChat>
    </Box >
  )
}

export default ChatBox