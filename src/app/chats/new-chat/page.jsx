'use client';
import {useCallback, useRef, useState} from 'react';
import {FormControl, InputLabel, OutlinedInput} from '@mui/material';
import styles from './NewChat.module.css';
import PageTitle from 'src/components/PageTitle';
import {showToast} from 'src/utils/toast';
import {useRouter} from 'next/navigation';
import {getChain} from 'dok-wallet-blockchain-networks/cryptoChain';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {XMTP} from 'src/utils/xmtp';
import {
  addConversation,
  setSelectedConversation,
} from 'dok-wallet-blockchain-networks/redux/messages/messageSlice';
import {useDispatch} from 'react-redux';
import Loading from 'src/components/Loading';

const NewChat = () => {
  const router = useRouter();
  const buttonRef = useRef();
  const formikRef = useRef();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onKeyDown = useCallback(e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      buttonRef.current?.focus?.();
    }
  }, []);

  const validateAndCreateConversation = async address => {
    const chain = getChain('ethereum');
    const isValid = await chain.isValidAddress({address});
    let validAddress = null;
    if (!isValid) {
      validAddress = await chain?.isValidName({name: values?.send});
    }
    if (!isValid && !validAddress) {
      formikRef.current?.setFieldError('address', 'Invalid address');
      return;
    }
    const isExists = await XMTP.checkAccountExists({
      address: validAddress || address,
    });
    if (!isExists) {
      showToast({
        type: 'errorToast',
        title: "Account doesn't exist",
      });
      return;
    }
    return XMTP.newConversation({address});
  };

  const onSubmit = async values => {
    try {
      setIsSubmitting(true);
      const conversation = await validateAndCreateConversation(values?.address);
      if (!conversation) return;

      const formattedConversation = await XMTP.formatConversation([
        conversation,
      ]);

      dispatch(
        addConversation({
          topic: formattedConversation[0].topic,
          conversationData: formattedConversation[0],
          address: formattedConversation[0].clientAddress,
        }),
      );
      dispatch(
        setSelectedConversation({
          address: formattedConversation[0].clientAddress,
          topic: formattedConversation[0].topic,
        }),
      );

      router.replace('/chats/chat');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in new message', error);
      showToast({
        type: 'errorToast',
        title: 'Something went wrong',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title='New Message' />
      <div className={styles.newChatContainer}>
        <p className={styles.title}>
          Enter a ethereum address to create a new message conversation
        </p>
        <Formik
          initialValues={{address: ''}}
          innerRef={formikRef}
          validationSchema={Yup.object().shape({
            address: Yup.string().required('address is required'),
          })}
          onSubmit={onSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <FormControl sx={{m: 1, width: '100%'}} variant='outlined'>
                <InputLabel
                  sx={{
                    color: errors.address ? 'red' : 'var(--borderActiveColor)',
                  }}
                  focused={false}>
                  Enter address
                </InputLabel>
                <OutlinedInput
                  multiline={true}
                  maxRows={4}
                  autoFocus={true}
                  id='address'
                  onKeyDown={onKeyDown}
                  name='address'
                  onChange={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  label='Enter address'
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.address
                        ? 'red'
                        : 'var(--sidebarIcon)',
                    },

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: errors.address
                        ? 'red'
                        : 'var(--borderActiveColor)',
                    },

                    '& .MuiInputLabel-outlined': {
                      color: errors.address ? 'red' : 'var(--sidebarIcon)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--sidebarIcon) !important',
                    },
                  }}
                />
              </FormControl>
              {errors.address && touched.address && (
                <p className={styles.textConfirm}>{errors.address}</p>
              )}

              <button
                type='submit'
                className={`${styles.button} ${!values.address && styles.disableBtn}`}
                disabled={!values.address || isSubmitting}
                ref={buttonRef}
                onClick={handleSubmit}>
                {isSubmitting ? (
                  <span className={styles.loaderBtnContainer}>
                    <Loading height='auto' size={26} color='var(--title)' />
                    <span className={styles.loaderBtnText}>Creating</span>
                  </span>
                ) : (
                  'Create'
                )}
              </button>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default NewChat;
