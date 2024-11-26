import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <nav>
          <ul className={styles.navLinks}>
            <li><a href="/">Terms of Service</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;