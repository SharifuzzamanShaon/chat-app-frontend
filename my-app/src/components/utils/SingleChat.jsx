import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from './ChatLogics'
import ProfileModal from '../Chat-Page-Module/ProfileModal'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import axios from 'axios'
import "./Style.css"
import ScrollableChats from './ScrollableChats'
import {io} from "socket.io-client"

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoaing] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const { selectedChat, setSelectedChat, userInfo } = useGlobalContext()
    const token = localStorage.getItem("token")
    const toast = useToast();



    const fetchMessage = async () => {

        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    "Content-Type": "Application/json",
                    Authorization: token
                }
            }
            setLoaing(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setLoaing(false)

            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: "error occured",
                description: "Failed to load the message",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
        }
    }


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: token
                    }
                }
                const { data } = await axios.post("/api/message/", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                setNewMessage("");
                socket.emit("new message", data);
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "error occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                })
            }
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", userInfo);
        socket.on("connection", () => setSocketConnected(true))
    }, [])


    useEffect(() => {
        fetchMessage();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectedChatCompare || 
                selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notificat..
            }
            else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })
    const typingHandler = (e) => {
        setNewMessage(e.target.value)
    }
    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            d="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center">

                            <IconButton
                                d={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {messages &&
                                (!selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(userInfo, selectedChat.users)}
                                        <ProfileModal userInfo={getSenderFull(userInfo, selectedChat.users)}/>
                                    </>
                                )
                                    : (
                                        <>
                                            {selectedChat.chatName.toUpperCase()}
                                                <UpdateGroupChatModel userInfo={userInfo} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessage={fetchMessage}></UpdateGroupChatModel>
                                            
                                        </>
                                    )
                            )}
                        </Text>
                        <Box
                            d="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                           
                            borderRadius="lg"
                            overflowY="hidden">
                            {
                                loading ? (<Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />) :
                                    <div className='messages'>
                                        <ScrollableChats messages={messages} userInfo={userInfo} />
                                    </div>
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input variant="filled" bg="#E0E0E0" placeholder='Type your message...' onChange={typingHandler} value={newMessage}></Input>
                            </FormControl>
                        </Box>
                    </>

                )
                    : (
                        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                                Click on a user to start chatting
                            </Text>
                        </Box>
                    )}
        </>
    );

}

export default SingleChat
