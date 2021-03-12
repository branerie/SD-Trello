import React, { useState } from 'react'
import styles from './index.module.css'
import LoginForm from '../../components/LoginForm'
import Transparent from '../../components/Transparent'
import SignupForm from '../../components/SignupForm'
import ForgotPasswordForm from '../../components/FormForgotPassword'
import logo from '../../images/logo.svg'
import welcomePagePic1 from '../../images/welcome-page/welcome-page-1.svg'
import welcomePagePic2 from '../../images/welcome-page/welcome-page-2.svg'
import welcomePagePic3 from '../../images/welcome-page/welcome-page-3.svg'
import welcomePagePic4 from '../../images/welcome-page/welcome-page-4.svg'
import welcomePagePic5 from '../../images/welcome-page/welcome-page-5.svg'
import welcomePagePic6 from '../../images/welcome-page/welcome-page-6.svg'
import twitter from '../../images/welcome-page/twitter-icon.svg'
import facebook from '../../images/welcome-page/facebook-icon.svg'
import instagram from '../../images/welcome-page/instagram-icon.svg'


const WelcomePage = () => {
  const [isLogInFormShown, setIsLogInFormShown] = useState(false)
  const [isSignUpFormShown, setIsSignUpFormShown] = useState(false)
  const [isForgotPassFormShown, setIsForgotPassFormShown] = useState(false)
  

  return (
    <div className={styles.container}>
      {
        isLogInFormShown &&
        <Transparent hideForm={() => setIsLogInFormShown(!isLogInFormShown)} >
          <LoginForm
            hideForm={() => setIsLogInFormShown(!isLogInFormShown)}
            goToSignUp={() => setIsSignUpFormShown(!isSignUpFormShown)}
            goToForgotPassword={() => setIsForgotPassFormShown(!isForgotPassFormShown)}
          />
        </Transparent >
      }
      {
        isSignUpFormShown &&
        <Transparent hideForm={() => setIsSignUpFormShown(!isSignUpFormShown)} >
          <SignupForm
            hideForm={() => setIsSignUpFormShown(!isSignUpFormShown)}
            goToLogin={() => setIsLogInFormShown(!isLogInFormShown)}
          />
        </Transparent >
      }
      {
        isForgotPassFormShown &&
        <Transparent hideForm={() => setIsForgotPassFormShown(!isForgotPassFormShown)} >
          <ForgotPasswordForm
            hideForm={() => setIsForgotPassFormShown(!isForgotPassFormShown)}
            goToSignUp={() => setIsSignUpFormShown(!isSignUpFormShown)}
          />
        </Transparent >
      }

      <div className={styles['content-wrap']}>
        <div className={styles['top-container']}>
          <div className={styles['top-div-container']}>
            <div className={styles['header-nav']}>
              <span className={styles.logo}>
                <img src={logo} alt='logo' width='100%' height='100%' />
              </span>
              <span className={styles['first-buttons']}>
                <button
                  className={styles['login-button']}
                  onClick={() => setIsLogInFormShown(!isLogInFormShown)}
                >Log In</button>
                <button
                  className={styles['sign-up-button']}
                  onClick={() => setIsSignUpFormShown(!isSignUpFormShown)}
                >Sign Up</button>
              </span>
            </div>
            <div className={styles.pic1}>
              <img src={welcomePagePic1} alt='' width='100%' />
            </div>
            <div className={styles.pic2}>
              <img src={welcomePagePic2} alt='' width='100%' />
            </div>
          </div>
          <div className={styles['lower-div-container']}>
            <div className={styles['first-text']}>
              <p className={styles.headers}>
                Manage your work in a
                <span className={styles.lucida}>Smart</span>
                 way!</p>
              <div className={styles.paragraph}>
                <p >The ideas get more clear, organized and focused on.</p>
                <p >Flexible and time saving for the whole team. </p>
                <button
                  className={styles['second-sign-up-button']}
                  onClick={() => setIsSignUpFormShown(!isSignUpFormShown)}
                >Free Sign Up</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['second-container']}>
          <div className={styles['first-row']}>
            <div className={styles['second-text']}>
              <p className={styles.headers}>Work and participate in different teams </p>
              <div className={styles.paragraph}>
                <p >Follow who and when is doing tasks. Be always</p>
                <p >informed with the accomplishment of the projects. </p>
                <button
                  className={styles['third-sign-up-button']}
                  onClick={() => setIsSignUpFormShown(!isSignUpFormShown)}
                >Try It Now</button>
              </div>
            </div>
            <div className={styles['pic3-container']}>
              <img className={styles.picture} src={welcomePagePic3} alt='' />
            </div>
          </div>
          <div className={styles['second-row']}>
            <div className={styles['pic4-container']}>
              <img className={styles.picture} src={welcomePagePic4} alt='' />
            </div>
            <div className={styles['second-row-colum']}>
              <div className={styles['second-text']}>
                <p className={styles.headers}>Еаsy to manage all the information</p>
                <div className={styles.paragraph}>
                  <p >Add stickers, notes, comments, attachments in your</p>
                  <p >  Smart Manager.</p>
                  <p >Collaborate with others in your Team.</p>
                </div>
              </div>
              <div className={styles['second-row-pic']} >
                <img className={styles.picture} src={welcomePagePic5} alt='' />
              </div>
            </div>
          </div>
          <div className={styles['third-row']}>
            <div className={styles['second-text']}>
              <p className={styles.headers}>Start your <span className={styles.lucida}>Smart Manager</span> Now </p>
              <div className={styles.paragraph}>
                <p >Connect with other teams from <span className={styles.lucida}>The Smart Family</span>,</p>
                <p > save time with more work done.</p>
                <button className={styles['second-sign-up-button']} onClick={() => setIsSignUpFormShown(!isSignUpFormShown)} >Get Started</button>
              </div>
            </div>
            <div className={styles['pic6-container']}>
              <img className={styles.picture} src={welcomePagePic6} alt='' />
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles['footer-column']}>
          <div className={styles['footer-headers']}>
            <p>Contact Us</p>
          </div>
          <div className={styles['footer-info']}>
            <p>+359 52 317 395</p>
            <p>smartmanager@gmail.com</p>
          </div>
        </div>

        <div className={styles['footer-column']}>
          <div className={styles['footer-headers']}>
            <p>SERVICES</p>
          </div>
          <div className={styles['footer-info']}>
            <p>Contact Us</p>
            <p>Ordering & Payment FAQ</p>
          </div>
        </div>

        <div className={styles['footer-column']}>
          <div className={styles['footer-headers']}>
            <p>INFORMATION</p>
          </div>
          <div className={styles['footer-info']}>
            <p>About SMART MANAGER</p>
            <p>Work With US</p>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>

        <div className={styles['last-column']}>
          <div className={styles['social-media-container']}>
            <span>
              <img className={styles['social-media']} src={instagram} alt='' />
            </span>
            <span>
              <img className={styles['social-media']} src={twitter} alt='' />
            </span>
            <span>
              <img className={styles['social-media']} src={facebook} alt='' />
            </span>
          </div>
          <div className={styles.sd2006}>SD2006</div>
        </div>
      </footer>
    </div>
  )
}

export default WelcomePage