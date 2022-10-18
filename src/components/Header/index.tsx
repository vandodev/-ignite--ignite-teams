import { Container, Logo, BackIcon } from "./styles";
import logoImg from '@assets/logo.png';


export function Header() {

  return (
    <Container>
      {/* <CaretLeft color="#fff" size={32}/> */}
      <BackIcon />
      <Logo source={logoImg} />
    </Container>
  )
}