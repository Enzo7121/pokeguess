import { useState, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import pokeApi from "./api";
import {
  Center,
  Stack,
  Text,
  Image,
  Input,
  Button,
  Heading,
  Container,
  Flex,
  Spinner,
  Box,
} from "@chakra-ui/react";
import JSConfetti from "js-confetti";
import "./App.css";
import { Pokemon } from "./types";
import victorySfx from "./sounds/victory.mp3";
import defeatSfx from "./sounds/defeat.mp3";
function App() {
  const [pokemon, setPokemon] = useState<Pokemon>({
    image: "",
    name: "",
    id: 0,
  });
  const [guessed, setGuessed] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [answered, setAnswered] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [missed, setMissed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const jsConfetti = new JSConfetti();

  const pokemonInput: any = useRef(null);

  const sfx = {
    victory: new Howl({
      src: victorySfx,
      volume: 0.2,
    }),
    defeat: new Howl({
      src: defeatSfx,
      volume: 0.2,
    }),
  };

  const inc = (n: number): number => n + 1;

  const getPokemon = async () => {
    setLoading(true);
    const res = await pokeApi.random();
    setPokemon(res);
    setLoading(false);
  };

  const onHandleEnter = (e: any) => {
    if (e.key === "Enter" && !answered && name) {
      handleAnswer();
    } else if (e.key === "Enter" && answered) {
      handleReset();
    }
  };

  const handleAnswer = () => {
    setAnswered(true);
    const formattedName = name.trim().toLowerCase().replace(/\./g, "");

    if (formattedName === pokemon.name) {
      sfx.victory.play();
      setGuessed(inc);
      localStorage.setItem("wins", String(inc(guessed)));
      setWon(true);
      jsConfetti.addConfetti();
      return;
    }
    sfx.defeat.play();
    setMissed(inc);
    localStorage.setItem("misses", String(inc(missed)));
  };

  const handleReset = () => {
    Howler.stop();
    pokemonInput.current.focus();
    setAnswered(false);
    setName("");
    setWon(false);
    getPokemon();
  };

  useEffect(() => {
    setMissed(Number(localStorage.getItem("misses")));
    setGuessed(Number(localStorage.getItem("wins")));
    getPokemon();
  }, []);

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      height="100vh"
      width="100vw"
    >
      <Box
        padding={6}
        margin="auto"
        backgroundColor="white"
        maxW="500px"
        rounded="20px"
      >
        <Center justifyContent="center" alignItems="center">
          <Stack
            width="100%"
            justifyContent="center"
            textAlign="center"
            marginTop={{ base: "1rem", md: "2rem", lg: "2rem" }}
          >
            {answered ? (
              <Stack>
                <Heading fontSize={{ base: "lg", md: "xl" }}>
                  The Pokemon is {pokemon.name}
                </Heading>
              </Stack>
            ) : (
              <Heading fontSize={{ base: "lg", md: "xl" }}>
                Who is this Pokemon?
              </Heading>
            )}
            <Stack alignItems="center">
              {loading ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              ) : (
                <Image
                  boxSize={{ base: "300px", lg: "400px", xl: "450px" }}
                  filter="auto"
                  transition="all 0.5s ease-out"
                  objectFit="cover"
                  maxWidth={{ base: "400px", md: "600px" }}
                  brightness={answered ? "100%" : "0%"}
                  src={pokemon.image}
                />
              )}
              <Stack direction="column">
                <Input
                  autoFocus={true}
                  value={name}
                  border="4px"
                  borderColor={answered ? (won ? "green" : "red") : "black"}
                  padding={5}
                  placeholder="Pokemon name..."
                  ref={pokemonInput}
                  onKeyDown={onHandleEnter}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  border="4px"
                  borderColor="black"
                  backgroundColor="blue.400"
                  color="white"
                  fontWeight="normal"
                  paddingX={10}
                  paddingY={5}
                  isDisabled={loading || answered || !name}
                  onClick={handleAnswer}
                >
                  Guess
                </Button>
              </Stack>
              <Stack direction="column" alignItems="center" fontSize="xl">
                <Stack>
                  <Text>Wins: {guessed}</Text>
                  <Text>Losses: {missed}</Text>
                </Stack>
                {answered && (
                  <Stack>
                    <Button
                      color="white"
                      border="4px"
                      borderColor="black"
                      fontWeight="normal"
                      paddingX={10}
                      paddingY={5}
                      backgroundColor="blue.400"
                      onClick={handleReset}
                    >
                      Volver a jugar
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Center>
      </Box>
    </Flex>
  );
}

export default App;
