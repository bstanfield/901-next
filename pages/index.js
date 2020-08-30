import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNewBoard } from '../lib/helpers/get-new-board'

export default function NewBoard({ id }) {
  return (
    <div>
      <h1>Creating board...</h1>
      {id ? <Link href="/board/[id]" as={`/board/${id}`}>Go to board</Link> : null}
    </div>
  );
};

export async function getServerSideProps(context) {
  const data = await getNewBoard();
  const id = data.id;

  return {
    props: {
      id
    },
  }
}

