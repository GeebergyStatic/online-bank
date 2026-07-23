import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Button,
    Input,
    Grid,
    GridItem,
    useToast,
    Spinner
} from '@chakra-ui/react';

const ConfirmPinModal = ({ isOpen, onClose, onSuccess, userId, isLoading, setIsLoading }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const toast = useToast();

    const handleKeyPress = (digit) => {
        if (pin.length < 4) setPin(pin + digit);
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://online-bank-qulz.onrender.com/api/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, pin }) // make sure userId is passed in props
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.message || 'Invalid PIN');
                toast({
                    title: 'PIN verification failed',
                    status: 'error',
                    duration: 2000,
                });
            } else {
                await onSuccess(); // Proceed with the action
                setPin('');
                onClose();
            }
        } catch (err) {
            setError('Server error');
            console.log(err);
        }

        setIsLoading(false);
    };


    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'];

    return (
        <Modal isOpen={isOpen} onClose={() => { setPin(''); onClose(); }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Your PIN</ModalHeader>
                <ModalCloseButton />
                <ModalBody textAlign="center" pb={6}>
                    <Input
                        value={pin.replace(/./g, '•')}
                        isReadOnly
                        size="lg"
                        mb={4}
                        textAlign="center"
                        fontSize="24px"
                        letterSpacing="8px"
                    />
                    <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                        {keypad.map((key, index) => (
                            <GridItem key={index}>
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        if (key === '←') handleBackspace();
                                        else if (key !== '') handleKeyPress(key);
                                    }}
                                >
                                    {key}
                                </Button>
                            </GridItem>
                        ))}
                    </Grid>
                    <Button
                        mt={6}
                        colorScheme="purple"
                        width="100%"
                        onClick={handleConfirm}
                        isDisabled={pin.length !== 4 || isLoading}
                    >
                        {isLoading ? <Spinner size="sm" /> : 'Confirm & Proceed'}
                    </Button>
                    {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmPinModal;
