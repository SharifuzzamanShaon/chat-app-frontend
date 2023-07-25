import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Button,
    Image,
    Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
const ProfileModal = ({ userInfo, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {
                children ? <span onClick={onOpen}>{children}</span> :
                    <IconButton onClick={onOpen} d={{ base: "flex" }} icon={<ViewIcon />}></IconButton>
            }
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="40px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"  bg='tomato'><Text fontSize="4xl">{userInfo.name}</Text></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody justifyContent="center">
                        <Image borderRadius='full'
                            boxSize='150px'
                            src={userInfo.picture}
                            alt={userInfo.name}></Image>
                        <Text fontSize="sm">{userInfo.email}</Text>
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

export default ProfileModal