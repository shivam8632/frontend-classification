import React, {useEffect} from 'react';
import RichTextEditor from '../toolbar/Toolbar';
import SideTab from '../sidetab/SideTab';
import './dashboard.scss';

function Dashboard() {
  return (
    <div className='dashboard py-4 py-md-0'>
        <div className="dashboard-container d-flex flex-column flex-md-row">
            <div className="dash-side col-md-4 col-lg-3 p-4">
                <SideTab />
            </div>
            <div className="dash-main mt-5 mt-md-0 col-md-8 col-lg-9 pt-md-3 px-lg-4">
                <p className='dash-head w-100 px-3' >New Document</p>
                <RichTextEditor />
            </div>
        </div>
    </div>
  )
}

export default Dashboard