import { sleep } from '@cryptoket/ts-promise-helper';
import { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useAsyncEffect } from '../helper/utility';
import { env } from '../helper/env';
import { SERVICE_EVENT } from '../services/interfaces';
import Head from 'next/head';
// import { firebaseRelogin } from '../services/Fireauth';

type WLink = React.Component['props'] & {
  href: string;
};
const wlinkAStyle: React.CSSProperties = {
  background: '#108db8',
  color: 'white',
  display: 'block',
  fontWeight: 'bold',
  margin: '10px',
  textDecoration: 'none',
};

function WLink(props: WLink): JSX.Element {
  return (
    <Link href={props.href}>
      <a style={wlinkAStyle}>
        {props.children}
      </a>
    </Link>
  );
}

const mainBannerStyle: React.CSSProperties = {
  background: '#108db8',
  borderRadius: '10px',
  float: 'left',
  margin: '10px',
  width: '200px',
};

const contentStyle: React.CSSProperties = {
  float: 'left',
  marginLeft: '10px',
  maxWidth: '1100px',
  width: '1100px',
};

interface INotification {
  error: boolean;
  message: string;
}

export function WithMainBanner(props: React.Component['props']): JSX.Element {
  return (
    <div style={{width: '100%' }}>
      <Head>
        <link href='/static/style.css' rel='stylesheet'></link>
        <link href='/static/bootstrap.css' rel='stylesheet'></link>
      </Head>
      <div style={mainBannerStyle}>
        <WLink href='/users'>Users</WLink>
      </div>
      <div style={contentStyle}>
        <div id='recaptcha-verifier'></div>
        {props.children}
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}
