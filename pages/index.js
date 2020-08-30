import React, { useEffect, useState } from 'react';
import path from 'path'
import fs from 'fs'
import Link from 'next/link';
import { getNewBoard } from '../lib/helpers/getNewBoard'

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

  const postsDirectory = path.join(process.cwd(), 'public')
  const filePath = path.join(postsDirectory, 'boards.json')
  const fileContents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log('fileContents: ', fileContents)
  fileContents[id] = data;
  console.log('new fileContents: ', fileContents)
  // const json = JSON.parse(fileContents)
  // json[id] = data
  fs.writeFileSync(filePath, JSON.stringify(fileContents))
  console.log('writing to file...')

  return {
    props: {
      id
    },
  }
}

