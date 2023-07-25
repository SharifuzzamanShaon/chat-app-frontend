import { Avatar, Box, Button, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Tooltip, WrapItem, useStatStyles } from '@chakra-ui/react'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import ChatLoading from '../utils/ChatLoading'
import UserListItem from '../utils/UserListItem'
import { useGlobalContext } from '../../context/ChatProvider'

const SideDrower = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchValue, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const token = localStorage.getItem("token")

    const { chats, setChats, setSelectedChat, userInfo } = useGlobalContext();

    const handleSearch = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: token
                }
            }
            const { data } = await axios.get(`/api/auth/get-users?search=${searchValue}`, config)
            setSearchResult(data.allUser);
            setLoading(false);
        } catch (error) {
            setLoading(false)
        }
    }
    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: token
                }
            }
            const data = await axios.post("/api/chat", { userId }, config)
            if (!chats.find((item) => item._id == data._id)) {
                setChats([data, ...chats]);
                // setFetchAgain(true)
            }
            setSelectedChat(data)
            window.location.reload(false);
        } catch (error) {
        }

    }
    return (
        <>
            <Box display='flex' width="100%" p="10px 10px 10px 10px" justifyContent='space-between'>
                <Tooltip>
                    <Button onClick={onOpen}>
                        <i className="fas fa-search" />
                        <Text d={{ base: "none" }} pl="5px">Search user</Text>
                    </Button>
                </Tooltip>
                <h2>Cheat CHat ZonE</h2>
                <div>
                    <Menu>
                        <BellIcon></BellIcon>
                        <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                            <Box d="flex" justifyContent="space-between">
                                <WrapItem>
                                    <Avatar size='sm' name={userInfo.name} src={userInfo.picture} />
                                </WrapItem>
                            </Box>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal userInfo={userInfo}>
                                <MenuItem>{userInfo.name}</MenuItem>
                            </ProfileModal>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Asds df</DrawerHeader>
                    <Box m="2px">
                        <InputGroup>

                            <Input placeholder="Search by name or email"
                                mr={2} type='text' value={searchValue} onChange={(e) => setSearch(e.target.value)} />
                            <InputRightElement>
                                <Button onClick={handleSearch} isLoading={loading}>Go</Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                    <DrawerBody>
                        {
                            loading ? <ChatLoading /> : (
                                searchResult.map((item) => {
                                    return <UserListItem handleFunction={() => accessChat(item._id)} user={item}></UserListItem>
                                })
                            )
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrower