import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ChatProvider'
import axios from 'axios';
import ChatLoading from '../utils/ChatLoading';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../utils/ChatLogics';
import GroupChatModel from './GroupChatModel';

const MyChats = ({ fetchAgain }) => {
  const { chats, setChats, selectedChat, setSelectedChat, userInfo } = useGlobalContext();
  const token = localStorage.getItem("token")
  const fetchChats = async () => {

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: token
        }
      }

      const { data } = await axios.get("/api/chat/", config)

      setChats(data);
    } catch (error) {
    }
  }
  useEffect(() => {
    fetchChats();
  }, [])
  return (
    <Box d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans" d="flex" w="100%" justifyContent="space-between">
        My Chats
        <GroupChatModel>
          <Button
            d="flex"
            fontSize={{ base: "15px", md: "8px", lg: "15px" }}
            rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden">
        {
          chats ? (
            <Stack overflowY='scroll'>
              {chats.map((chat) => (
                <Box onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}>
                  <Text>
                    {!chat.isGroupChat ?
                      getSender(userInfo, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (<ChatLoading />)
        }
      </Box>
    </Box>
  )
}

export default MyChats