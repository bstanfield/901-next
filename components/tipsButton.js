import {
  Tooltip,
} from 'react-tippy';

export default function tipsButton() {
  return (

    <div className="circle">
      <Tooltip
        // options
        title="View tips & tricks"
        interactive={true}
        html={<a className='tooltipText' href='/tips'>View tips & tricks</a>}
        position="left"
        trigger="mouseenter"
        distance={16}
        offset={-16}
        animation="fade"
        animateFill={false}
      >
        <div className="questionMark"><a style={{ cursor: 'help', textDecoration: 'none' }} className='tooltipText' href='/tips'>?</a></div>
      </Tooltip >
    </div >

  )
}