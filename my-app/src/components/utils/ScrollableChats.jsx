import React from 'react'
import { isLastMsg, isSameSender, isSameSenderMargin } from './ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { useGlobalContext } from '../../context/ChatProvider'
import ScrollableFeed from 'react-scrollable-feed'

const ScrollableChats = ({ messages }) => {
  const { userInfo } = useGlobalContext();
  return (
    <ScrollableFeed>
      {
        messages.map((m, i) => (

          <div style={{ display: "flex" }} key={m._id}>
            {
              (isSameSender(messages, m, i, userInfo._id) ||
                isLastMsg(messages, i, userInfo._id)
              ) && <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.picture}
                />
              </Tooltip>
            }
            <span
              style={{
                backgroundColor: `${m.sender._id === userInfo._id ? "#BEE3F8" : "#B9F5D0"}`,
                marginLeft: isSameSenderMargin(messages, m, i, userInfo._id),
                // marginTop: isSameUser(messages, m, i, userInfo._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChats
