import React from 'react'
import '../App.css'
function JoinRoom() {
  return (
    <>
    <div style={{
        background:'#d1d1d1',
        width:'100%',
        height:'100vh'
    }}
    id='joincontainer'
    >
        <div className='joinbox'>
        <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"/>
  </div>
  <div class="mb-3">
  <label for="exampleInputEmail1" class="form-label">Community Id</label>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
</div>
  <button type="submit" class="btn btn-primary w-100">Join Community</button>
</form>
        </div>
    </div>
    </>
  )
}

export default JoinRoom