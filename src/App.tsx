import { useState, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import JSConfetti from "js-confetti";
import "./App.css";
import { Pokemon } from "./types";

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

  const inc = (n: number): number => n + 1;

  const getPokemon = async () => {
    setLoading(true);
    const res = await pokeApi.random();
    setPokemon(res);
    setLoading(false);
  };

  const handleAnswer = () => {
    setAnswered(true);
    const formattedName = name.trim().toLowerCase().replace(/\./g, "");

    if (formattedName === pokemon.name) {
      setGuessed(inc);
      localStorage.setItem("wins", String(inc(guessed)));
      setWon(true);
      jsConfetti.addConfetti();
      return;
    }
    setMissed(inc);
    localStorage.setItem("misses", String(inc(missed)));
  };

  const handleReset = () => {
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
    <Container>
      <Center>
        <Stack
          width="100%"
          justifyContent="center"
          textAlign="center"
          marginTop={{ base: "2rem", md: "3rem", lg: "3rem" }}
        >
          {answered ? (
            <Stack>
              <Heading fontSize={{ base: "lg", md: "2xl" }}>
                The Pokemon is {pokemon.name}
              </Heading>
            </Stack>
          ) : (
            <Heading fontSize={{ base: "lg", md: "2xl" }}>
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
    </Container>
  );
}

export default App;
