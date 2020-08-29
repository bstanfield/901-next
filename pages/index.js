import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { hitAPIEndpoint } from '../helpers/util'

export default function NewBoard({ url }) {
  return (
    <div>
      <h1>Creating board...</h1>
      {url ? <Redirect to={`/board/${url}`} /> : null}
    </div>
  );
};

export async function getServerSideProps(context) {
  const board = await hitAPIEndpoint('get', 'get-new-board');
  console.log('board: ', board);
  setUrl(board.id);
  const id = board.id;


  return {
    props: {
      id
    },
  }
}

