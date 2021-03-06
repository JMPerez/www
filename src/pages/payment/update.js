/* global fetch */

import React, { Component } from 'react'
import { useSiteMetadata } from 'components/hook'
import styled from 'styled-components'
import { Choose } from 'react-extras'
import { encode, decode } from 'qss'

import {
  Label,
  Container,
  ButtonSecondary,
  Notification,
  LinkSolid,
  Flex,
  StripeLoader
} from 'components/elements'

import { Header, Layout } from 'components/patterns'

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  StripeProvider,
  injectStripe,
  Elements
} from 'react-stripe-elements'

const PAYMENT_STATE = {
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed'
}

const ERROR_MAIL_OPTS = {
  subject: 'Payment update error',
  body:
    'Hello,\n\nSomething bad happens trying to update my payment method at microlink.io/payment.\n\nCan you help me?'
}

const Form = styled.form`
  .StripeElement {
    display: block;
    margin: 10px 0 20px 0;
    max-width: 100%;
    padding: 10px 14px;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
      rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border-radius: 4px;
    background: white;
  }

  .StripeElement--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
      rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
  }
`

const createOptions = fontSize => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, Menlo, monospace',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

class _CardForm extends Component {
  state = { paymentState: null }

  handleSubmit = event => {
    event.preventDefault()
    const { apiKey, apiEndpoint, stripe } = this.props

    this.setState({ paymentState: PAYMENT_STATE.PROCESSING })

    stripe
      .createToken()
      .then(({ token }) =>
        fetch(`${apiEndpoint}/batch/series`, {
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          method: 'POST',
          body: JSON.stringify([
            {
              command: 'payment.update',
              customerId: decode(window.location.search.substring(1)).id,
              token
            },
            { command: 'notification.email', templateId: 'payment_updated' }
          ])
        })
      )
      .then(res => res.json())
      .then(({ status }) =>
        this.setState({ paymentState: PAYMENT_STATE.SUCCESS })
      )
      .catch(err => {
        console.error(err)
        this.setState({ paymentState: PAYMENT_STATE.FAILED })
      })
  }

  render () {
    const { paymentState } = this.state

    return (
      <>
        {paymentState && (
          <Choose>
            <Choose.When condition={paymentState === PAYMENT_STATE.PROCESSING}>
              <Notification.Success children='Processing...' />
            </Choose.When>
            <Choose.When condition={paymentState === PAYMENT_STATE.SUCCESS}>
              <Notification.Success children='Payment updated! We sent you an email.' />
            </Choose.When>
            <Choose.When condition={paymentState === PAYMENT_STATE.FAILED}>
              <Notification.Error>
                Payment not updated.{' '}
                <LinkSolid
                  display='inline'
                  children='Contact us'
                  color='red8'
                  href={`mailto:hello@microlink.io?${encode(ERROR_MAIL_OPTS)}`}
                />
                {'.'}
              </Notification.Error>
            </Choose.When>
          </Choose>
        )}

        <Form onSubmit={this.handleSubmit}>
          <Label
            textAlign='left'
            display='block'
            fontSize={0}
            color='gray6'
            mb={4}
          >
            Card number
            <CardNumberElement {...createOptions(this.props.fontSize)} />
          </Label>

          <Label
            textAlign='left'
            display='block'
            fontSize={0}
            color='gray6'
            mb={4}
          >
            Expiration date
            <CardExpiryElement {...createOptions(this.props.fontSize)} />
          </Label>

          <Label
            textAlign='left'
            display='block'
            fontSize={0}
            color='gray6'
            mb={4}
          >
            CVC
            <CardCvcElement {...createOptions(this.props.fontSize)} />
          </Label>

          <ButtonSecondary
            children='Update Card'
            loading={paymentState === PAYMENT_STATE.PROCESSING}
          />
        </Form>
      </>
    )
  }
}

const CardForm = injectStripe(_CardForm)

export default () => {
  const {
    stripeKey,
    paymentApiKey: apiKey,
    paymentEndpoint: apiEndpoint
  } = useSiteMetadata()

  return (
    <Layout title='Update Payment'>
      <StripeLoader stripeKey={stripeKey}>
        {stripe => {
          return (
            <Container as='section' maxWidth='350px' pt={5}>
              <StripeProvider stripe={stripe}>
                <Flex flexDirection='column'>
                  <Header subtitle='Update Payment' />
                  <Elements>
                    <CardForm
                      apiEndpoint={apiEndpoint}
                      apiKey={apiKey}
                      fontSize='18px'
                    />
                  </Elements>
                </Flex>
              </StripeProvider>
            </Container>
          )
        }}
      </StripeLoader>
    </Layout>
  )
}
