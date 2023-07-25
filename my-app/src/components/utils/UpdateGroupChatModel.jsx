import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useGlobalContext } from '../../context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'

const UpdateGroupChatModel = ({fetchAgain,setFetchAgain}) => {
    const [groupChatName, setGroupChatName] = useState()
    const [renameLoading, setRenameLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const token = localStorage.getItem("token")
    const { selectedChat, setSelectedChat } = useGlobalContext()
    const toast = useToast();
    const removeUser = (user) => {
        // setSelectedChat(selectedChat.users.filter((sel) => sel._id !== user._id))
    }
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: token
                }
            }
            const { data } = await axios.put("/api/chat/rename", {
                chatName: groupChatName,
                id: selectedChat._id
            }, config)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
            toast({
                title: "Group name updated",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            setGroupChatName("")
        } catch (error) {
            toast({
                title: "Error occured",
                description:error.response.data.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
        }
    }
    return (
        <>
            <IconButton d={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input type="text" placeholder="Upade Group Name" onChange={(e) => setGroupChatName(e.target.value)}></Input>
                            <Button onClick={handleRename}>Update</Button>
                        </FormControl>
                        <Box>
                            {
                                selectedChat.users.map((user) => {
                                    return <UserBadgeItem user={user} handleFunction={() => removeUser(user)} />
                                })
                            }
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModel
