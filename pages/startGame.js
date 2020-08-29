/** @jsx jsx */

import { useEffect, useState } from 'react';
import { jsx } from '@emotion/core';
import * as R from 'ramda';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SetToast } from '../actions/toaster';
import { EndTurn, NewGame } from '../actions/game';
import { GuessCard } from '../actions/guesses';
import { scale, projectCardScale } from '../style/scale';
import { contentContainer } from '../style/layout';
import { maxWidth, fullWidth, marginAuto } from '../style/misc';
import { genericFlex, noWrapFlex, justifyContentStart } from '../style/flex';

import TextInput from '../components/UI/TextInput';
import handWave from '../static/images/waving-hand.png';
import Dialog from '../components/UI/Dialog';
import Card from '../components/board/Card';
import CardContent from '../components/UI/CardContent';
import Button from '../components/UI/Button';

import { hitAPI } from '../helpers/util';

const roleButton = scale({
  width: ['100%', '100%', '32%'],
});

const messageIcon = scale({
  height: 'auto',
  position: 'absolute',
  top: ['-30px', '-30px', '-30px', '-40px'],
  left: '0',
  right: '0',
  margin: 'auto',
  width: ['50px', '50px', '50px', '60px'],
  marginBottom: '15px',
  zIndex: 100000,
});

const StartGame = props => {
  const { board, match, game } = props;
  const { teamTurn } = game;
  const { words } = board;

  const [boardCode, setBoardCode] = useState(match.params.gameUrl);
  const [role, setRole] = useState('player');
  const [redirectLink, setRedirectLink] = useState();

  const asyncRedirect = async () => {
    let boardCodeToUse = boardCode;
    if (!boardCode) {
      boardCodeToUse = await props.NewGame();
    }
    const link =
      role === 'team1'
        ? `/game-master-1/${boardCodeToUse}`
        : role === 'team2'
        ? `/game-master-2/${boardCodeToUse}`
        : `/player-board/${boardCodeToUse}`;
    setRedirectLink(link);
  };

  if (redirectLink) {
    return <Redirect push to={redirectLink} />;
  }

  return (
    <div>
      <Dialog showDialog={true}>
        <CardContent>
          <img src={handWave} css={messageIcon} />
          <h2>Welcome to Catchwords!</h2>
          <br />
          <p>
            To begin, please choose your role. If you'd like to enter an
            existing game, please paste in the board code below:
          </p>
          <div css={genericFlex}>
            <div css={roleButton}>
              <Button
                size="medium"
                type={role === 'player' ? 'green' : 'invertedGreen'}
                text="Player"
                onClickFn={() => setRole('player')}
              />
            </div>
            <div css={roleButton}>
              <Button
                size="medium"
                type={role === 'team1' ? 'green' : 'invertedGreen'}
                text="Team 1 Game Leader"
                onClickFn={() => setRole('team1')}
              />
            </div>
            <div css={roleButton}>
              <Button
                size="medium"
                type={role === 'team2' ? 'green' : 'invertedGreen'}
                text="Team 2 Game Leader"
                onClickFn={() => setRole('team2')}
              />
            </div>
          </div>
          <br />
          <TextInput
            handleInputChange={v => setBoardCode(v)}
            placeholder="Board Code"
            value={boardCode}
          />
          <br />
          <br />
          <Button
            size="large"
            text={boardCode ? 'Enter existing game' : 'Start New Game'}
            onClickFn={() => asyncRedirect()}
          />
        </CardContent>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    board: state.board,
    game: state.game,
    toaster: state.toaster,
    guesses: state.guesses,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { EndTurn, NewGame, GuessCard, SetToast },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StartGame)
);
