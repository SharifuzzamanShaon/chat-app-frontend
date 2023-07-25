import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, slideFadeConfig, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import UserListItem from '../utils/UserListItem';
import UserBadgeItem from '../utils/UserBadgeItem';
import { useGlobalContext } from '../../context/ChatProvider';

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchedResult, setSearchedResult] = useState([]);
    const token = localStorage.getItem("token")
    const toast = useToast();

    const { chats, setChats } = useGlobalContext();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: token
                }
            }
            const { data } = await axios.get(`/api/auth/get-users?search=${query}`, config);
            setSearchedResult(data.allUser);
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    const handleGroup = (user) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([user, ...selectedUsers])
    }
    const deleteUser = (user) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Chat name & Group member required",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: token
                }
            }
            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => user._id))
            }, config)
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input type="text" placeholder='Group name' mb={3} onChange={(e) => setGroupChatName(e.target.value)}></Input>
                        </FormControl>
                        <FormControl>
                            <Input type="text" placeholder="Add Users eg: John, Piyush, Jane" mb={3} onChange={(e) => handleSearch(e.target.value)}></Input>
                        </FormControl>
                        {selectedUsers.map((user) => {
                            return <UserBadgeItem key={user._id} handleFunction={() => deleteUser(user)} user={user} />
                        })}
                        {loading ? (<div>loading...</div>) : (
                            searchedResult.map((user) => {
                                return <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} ></UserListItem>
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default GroupChatModel
