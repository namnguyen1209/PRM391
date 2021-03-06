import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {
  Container,
  Button,
  Content,
  Form,
  Item,
  Input,
  Text,
} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';
import {host} from '../constants/host';

type AuthScreenProps = StackNavigationProp<any, any>;

interface IProps {
  navigation: AuthScreenProps,
}

const Login = ({navigation, ...props}: IProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const loginAsync = async () => {
    try {
      await fetch(host + '/api/v1/identity/login', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      }).then(async (response) => {
        if (response.status === 200) {
          const json = await response.json();
          setUser(json.jwtToken);
        } else {
          Alert.alert('Error: Code ' + response.status);
        }
      }).catch((error) => {
        setMessage(error.message);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setMessage('Done');
    }
  };

  useEffect(() => {
    if (user !== '') {
      navigation.navigate('Secured', {jwt: user});
    }
  }, [user]);

  const loginClick = async () => {
    setMessage('Login...');
    await loginAsync();
  };
  return (
    <Container>
      <Grid>
        <Row size={25}>
          {message ? <Text>{message}</Text> : <Text> </Text>}
          <Text>{user}</Text>
        </Row>
        <Row size={50}>
          <Content>
            <Form>
              <Item>
                <Input placeholder="username" value={username}
                  onChangeText={(value) => setUsername(value)}/>
              </Item>
              <Item>
                <Input placeholder="password" value={password}
                  onChangeText={(value) => setPassword(value)}/>
              </Item>
            </Form>
          </Content>
        </Row>
        <Row size={25}>
          <Col>
            <Button primary
              onPress={() => loginClick()}
              style={styles.button}>
              <Text>
                Login
              </Text>
            </Button>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
});

export default Login;
