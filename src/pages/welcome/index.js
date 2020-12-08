import React from "react"
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import pic1 from '../../images/welcome-page/welcome-page-1.svg'
import pic2 from '../../images/welcome-page/welcome-page-2.svg'
import pic3 from '../../images/welcome-page/welcome-page-3.svg'
import pic4 from '../../images/welcome-page/welcome-page-4.svg'
import pic5 from '../../images/welcome-page/welcome-page-5.svg'
import pic6 from '../../images/welcome-page/welcome-page-6.svg'
import instagram from '../../images/welcome-page/instagram-icon.svg'
import twitter from '../../images/welcome-page/twitter-icon.svg'
import facebook from '../../images/welcome-page/facebook-icon.svg'


import { useHistory } from "react-router-dom"



const WelcomePage = () => {

  const history = useHistory()

  function goToLogin() {
    history.push('/login')
  }

  function goToSignUp() {
    history.push('/sign-up')
  }

  return (

    <div className={styles.pageContainer}>

      <div className={styles.contentWrap}>

        <div className={styles.topContainer}>
          <div className={styles.topDivtopContainer}>
            <div className={styles.headerNav}>
              <span className={styles.logo}>
                <img src={logo} alt="logo" width='194' height='142' />
              </span>
              <span className={styles.firstButtons}>
                <button className={styles.loginButton} onClick={goToLogin} >Log In</button>
                <button className={styles.signUpButton} onClick={goToSignUp} >Sign Up</button>
              </span>
            </div>
            <div className={styles.topright}>
              <div className={styles.pic1}>
                <img src={pic1} alt="" />
                {/* width="800" height="630" */}
              </div>
              <div className={styles.pic2}>
                <img src={pic2} alt="" />
                {/* width="450" height="350" */}
              </div>
            </div>
          </div>


          <div className={styles.lowerDivtopContainer}>
            <div className={styles.firstText}>
              <p className={styles.headers}>Manage your work in a <span className={styles.lucida}>Smart</span> way! </p>
              <div className={styles.paragraph}>
                <p >The ideas get more clear, organized and focused on.</p>
                <p >Flexible and time saving for the whole team. </p>
              </div>
              <div className={styles.paragraph}>
                <button className={styles.secondSignUpButton} onClick={goToSignUp} >Free Sign Up</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.secondContainer}>
          <div className={styles.firstRow}>
            <div className={styles.secondText}>
              <p className={styles.headers}>Work and participate in different teams </p>
              <div className={styles.paragraph}>
                <p >Follow who and when is doing tasks. Be always</p>
                <p >informed with the accomplishment of the projects. </p>
              </div>
              <div className={styles.paragraph}>
                <button className={styles.thirdSignUpButton} onClick={goToSignUp} >Try It Now</button>
              </div>
            </div>
            <div className={styles.pic3Container}>
              <img className={styles.pic3} src={pic3} alt="" />
            </div>
          </div>

          <div className={styles.secondRow}>
            <div className={styles.pic4Container}>
              <img className={styles.pic4} src={pic4} alt="" />
            </div>
            <div className={styles.thirdText}>
              <p className={styles.headers}>Еаsy to manage all the information</p>
              <div className={styles.paragraph}>
                <p >Add stickers, notes, comments, attachments in your</p>
                <p >  Smart Manager.</p>
                <p >Collaborate with others in your Team.</p>
                <img className={styles.pic5} src={pic5} alt="" />
              </div>
            </div>
          </div>

          <div className={styles.thirdRow}>
            <div className={styles.lastText}>
              <p className={styles.lastHeaders}>Start your <span className={styles.lucida}>Smart Manager</span> Now </p>
              <div className={styles.lastParagraph}>
                <p >Connect with other teams from <span className={styles.lucida}>The Smart Family</span>,</p>
                <p > save time with more work done.</p>
                <button className={styles.lastSignUpButton} onClick={goToSignUp} >Get Started</button>
              </div>
            </div>
            <div className={styles.pic6Container}>
              <img className={styles.pic6} src={pic6} alt="" />
            </div>
          </div>



        </div>

      </div>

      <footer className={styles.footer}>

        <div className={styles.footerColumn}>
          <div className={styles.footerHeaders}>
            <p>Contact Us</p>
          </div>
          <div className={styles.footerInfo}>
            <p>+359 52 317 395</p>
            <p>smartmanager@gmail.com</p>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <div className={styles.footerHeaders}>
            <p>SERVICES</p>
          </div>
          <div className={styles.footerInfo}>
            <p>Contact Us</p>
            <p>Ordering {`&amp`} Payment FAQ</p>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <div className={styles.footerHeaders}>
            <p>INFORMATION</p>
          </div>
          <div className={styles.footerInfo}>
            <p>About SMART MANAGER</p>
            <p>Work With US</p>
            <p>Privacy Policy</p>
            <p>Terms &amp Conditions</p>

          </div>
        </div>

        <div className={styles.lastColumn}>
          <div className={styles.socialMediaContainer}>
            <span>
            <img className={styles.socialMedia} src={instagram} alt="" />
            </span>
            <span>
            <img className={styles.socialMedia} src={twitter} alt="" />
            </span>
            <span>
            <img className={styles.socialMedia} src={facebook} alt="" />
            </span>
          </div>
          <div className={styles.sd2006}>&#169 SD2006</div>

        </div>

      </footer>

    </div>
  )
}

export default WelcomePage