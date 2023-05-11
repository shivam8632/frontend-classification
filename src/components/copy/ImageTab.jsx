import React from 'react'

function ImageTab() {
  return (
    <div className="image-tab">
        <form className='justify-content-center'>
            <div className="input-container w-100">
                <label htmlFor="">Enter Image description</label>
                <textarea name="" id="" cols="30" rows="10"></textarea>
            </div>
            <button className='button button-fill'>Draw for me</button>
        </form>
    </div>
  )
}

export default ImageTab