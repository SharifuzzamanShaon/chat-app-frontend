import SideDrower from '../Chat-Page-Module/SideDrower'
import { Box } from '@chakra-ui/react'
import MyChats from '../Chat-Page-Module/MyChats'
import ChatBox from '../Chat-Page-Module/ChatBox'
import { useGlobalContext } from '../../context/ChatProvider'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ChatPage = () => {
    // const [userInfo, setUserInfo] = useState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const navigate = useNavigate()
    const { userInfo } = useGlobalContext()

    const fetchChats = async () => {
        await axios.get('/api/all-chats')
    }

    useEffect(() => {
        fetchChats();
    }, [fetchAgain])
    return (
        <div style={{ width: "100%"}}>
            {userInfo && <SideDrower setFetchAgain={setFetchAgain} userInfo={userInfo} />}
            <Box display="flex" justifyContent='space-between' w='100%' h="91.5vh">
                {userInfo && <MyChats userInfo={userInfo} fetchAgain={fetchAgain} />}
                {userInfo && <ChatBox userInfo={userInfo} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>

        </div>

    )
}

export default ChatPage