/** @jsx jsx */

import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch'
import { jsx } from '@emotion/core';
import useSWR from 'swr'
import { scale } from '../../styles/scale';
import path from 'path';
import fs from 'fs';
import { triggerModal, findCorrectGuesses, findIncorrectGuesses } from '../../lib/util'
import Cards from '../../components/Cards';
import words from 'random-words';

const primaryContainer = scale({
  maxWidth: '1000px',
  margin: 'auto',
  'h1, h2, h3, h4, p, a': {
    fontFamily: 'system-ui !important',
    margin: 0,
  },
  h4: {
    fontWeight: 500,
  }
});

const topContainer = scale({
  position: 'relative',
  paddingTop: '12px',
  paddingBottom: '12px',
  marginBottom: '16px',
  borderBottom: '2px solid #e0e0e0',
});

const pageFade = scale({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  width: '100vw',
  height: '100%',
  zIndex: 9999,
});

const modal = scale({
  borderRadius: '6px',
  fontFamily: 'system-ui',
  backgroundColor: 'white',
  padding: '20px 40px'
});

const absolutePassTurn = (guesses) => scale({
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '3px',
  margin: '20px 20px 20px 0',
  fontSize: '22px',
  position: 'absolute',
  top: '-12px',
  right: '-12px',
  opacity: guesses > 0 ? 1 : 0.5,
  '&:hover': {
    opacity: 1,
  }
});

const buttonStyle = (showing) => scale({
  padding: '8px 18px',
  borderRadius: '3px',
  border: 'none',
  cursor: 'pointer',
  margin: '20px 20px 20px 0',
  fontSize: '20px',
  backgroundColor: showing ? '#2ef72e' : '#eeeeee',
  '&:hover': {
    backgroundColor: showing ? '#2ef72e' : '#d0d0d0',
    opacity: showing ? 0.7 : 1,
  }
});

const hitAPIEndpoint = (method, endpoint, body) => {
  const response = fetch(`/api/${endpoint}`, {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
};

const fetcher = async (url) => {
  const response = await hitAPIEndpoint('GET', url)
  return response.json()
}

export default function Board({ boardData, id }) {
  // STATE -----
  // Board state
  const [board, setBoard] = useState([]);
  const [localTurnCount, setLocalTurnCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentTurnGuesses, setCurrentTurnGuesses] = useState(0);
  const [freshData, setFreshData] = useState({});

  // Card state
  const [selectedCards, setSelectedCards] = useState([]);
  const [showRemove, setShowRemove] = useState(false);
  const [refreshCard, triggerRefreshCard] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [guessingState, setGuessingState] = useState(true); // false = word swap mdoe

  // Team state
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [redGuesses, setRedGuesses] = useState([]);
  const [blueGuesses, setBlueGuesses] = useState([]);
  const [correctRedGuesses, setCorrectRedGuesses] = useState([]);
  const [correctBlueGuesses, setCorrectBlueGuesses] = useState([]);

  const [showCheatsheet, setCheatsheet] = useState({ blue: false, red: false });
  // END STATE -----

  // Loads board
  useEffect(() => {
    if (boardData) {
      const loadDataIntoState = async () => {
        const { words, red, blue, redGuesses, blueGuesses, turnCount } = boardData;
        setBoard(words);
        setRedTeam(red);
        setBlueTeam(blue);
        setRedGuesses(redGuesses || []);
        setBlueGuesses(blueGuesses || []);
        const allIncorrectGuesses = findIncorrectGuesses(red, blueGuesses || []).concat(findIncorrectGuesses(blue, redGuesses || []));
        setIncorrectGuesses(allIncorrectGuesses);
        setCorrectRedGuesses(findCorrectGuesses(blue, redGuesses || []));
        setCorrectBlueGuesses(findCorrectGuesses(red, blueGuesses || []));
        setLocalTurnCount(turnCount);
      }
      loadDataIntoState();
    }
  }, [boardData]);

  const { data, error } = useSWR(`get-board/${id}`, fetcher, { refreshInterval: 2000 })

  useEffect(() => {
    if (data) {
      const { red, blue, redGuesses, blueGuesses, turnCount } = data
      setRedGuesses(redGuesses || []);
      setBlueGuesses(blueGuesses || []);
      const allIncorrectGuesses = findIncorrectGuesses(red, blueGuesses || []).concat(findIncorrectGuesses(blue, redGuesses || []));
      setIncorrectGuesses(allIncorrectGuesses);
      setCorrectRedGuesses(findCorrectGuesses(blue, redGuesses || []));
      setCorrectBlueGuesses(findCorrectGuesses(red, blueGuesses || []));
      setLocalTurnCount(turnCount);
    }
  }, [data])


  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     console.log('retrieving fresh data...')
  //     console.log('id: ', id)
  //     const freshData = JSON.stringify(await getExistingBoard(id))
  //     console.log('fresh data: ', freshData)
  //     // const { red, blue, redGuesses, blueGuesses, turnCount } = JSON.parse(freshData);
  //     // setRedGuesses(redGuesses || []);
  //     // setBlueGuesses(blueGuesses || []);
  //     // const allIncorrectGuesses = findIncorrectGuesses(red, blueGuesses || []).concat(findIncorrectGuesses(blue, redGuesses || []));
  //     // setIncorrectGuesses(allIncorrectGuesses);
  //     // setCorrectRedGuesses(findCorrectGuesses(blue, redGuesses || []));
  //     // setCorrectBlueGuesses(findCorrectGuesses(red, blueGuesses || []));
  //     // setLocalTurnCount(turnCount);
  //   }, 2000);

  //   return () => clearInterval(intervalId);
  // }, [data]);

  // useEffect(() => {
  //   if (localTurnCount === 1) return;
  //   triggerModal(setShowModal);
  // }, [localTurnCount]);

  // useEffect(() => {
  //   setCorrectBlueGuesses(findCorrectGuesses(redTeam, blueGuesses || []));
  //   setCorrectRedGuesses(findCorrectGuesses(blueTeam, redGuesses || []));
  // }, [blueTeam, redTeam, redGuesses, blueGuesses]);

  return (
    <div>
      {showModal &&
        <div css={pageFade}>
          <div css={modal}>
            <h1>{localTurnCount % 2 === 0 ? "🔷 Blue: Give a clue!" : "🔴 Red: Give a clue!"}</h1>
          </div>
        </div>
      }
      <div css={primaryContainer}>
        <div css={topContainer}>
          <h2 style={{ fontSize: 30, display: 'inline', marginRight: '20px' }}>{localTurnCount % 2 === 0 ? "🔷 Blue: Give a clue!" : "🔴 Red: Give a clue!"} </h2>
          <strong><p style={{ position: 'absolute', top: 20, right: 160, opacity: 0.7 }}>Turn #{localTurnCount}</p></strong>
          <button css={absolutePassTurn(currentTurnGuesses)} onClick={() => {
            const newTurnCount = Number(localTurnCount) + 1
            fetch(`/api/update-turn/${id}/${newTurnCount}`)
            setLocalTurnCount(newTurnCount);
            setCurrentTurnGuesses(0);
          }}>End turn</button>
        </div>
        {/* <div css={genericFlex}>{board.map((item, index) => RenderCard(item, index))}</div> */}
        <Cards
          refreshCard={refreshCard}
          state={{
            board, localTurnCount, showModal, currentTurnGuesses, id,
            selectedCards, showRemove, refreshCard, correctBlueGuesses, correctRedGuesses,
            redTeam, blueTeam, blueGuesses, redGuesses, showCheatsheet, incorrectGuesses, guessingState
          }}
          modifiers={{
            setCorrectBlueGuesses, setCorrectRedGuesses, setBlueGuesses,
            setRedGuesses, setCurrentTurnGuesses, setBoard, triggerRefreshCard
          }}
        />
        <button css={buttonStyle(showCheatsheet.red)} onClick={() => { showCheatsheet.red === false ? setCheatsheet({ blue: false, red: true }) : setCheatsheet({ blue: false, red: false }) }} >
          <span role="img" aria-label="Red circle">🔴</span> Red cheatsheet
        </button>
        <button css={buttonStyle(showCheatsheet.blue)} onClick={() => { showCheatsheet.blue === false ? setCheatsheet({ blue: true, red: false }) : setCheatsheet({ blue: false, red: false }) }} >
          <span role="img" aria-label="Blue diamond">🔷</span> Blue cheatsheet
        </button>
        <button css={buttonStyle(showRemove)} onClick={() => {
          if (showRemove === false) {
            setShowRemove(true)
            setGuessingState(false)
          } else {
            setShowRemove(false)
            setGuessingState(true)
          }
        }} >
          Edit words
        </button>
        <button css={buttonStyle(showRemove)} onClick={() => {
          // sets turn count to 1 and current turn guesses to none
          hitAPIEndpoint('post', `update-turn`, {
            id,
            turnCount: 1,
          });
          setCurrentTurnGuesses(0);

          // resets player guesses
          hitAPIEndpoint('post', `update-guesses`, {
            id: id,
            team: 'red',
            guesses: []
          });
          hitAPIEndpoint('post', `update-guesses`, {
            id: id,
            team: 'blue',
            guesses: []
          });
        }} >
          Reset answers
        </button>
        <a href="/new"><button css={buttonStyle(showRemove)}>
          New board
        </button></a>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const id = context.params.id
  // const { data, error } = useSWR(`get-board/${id}`, fetcher)
  // const boardData = data
  const postsDirectory = path.join(process.cwd(), 'public')
  const filePath = path.join(postsDirectory, 'boards.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  console.log('fileContents: ', fileContents[id])

  return {
    props: {
      id,
      boardData: []
    },
  }
}
