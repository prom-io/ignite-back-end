# How to test Data Validator Node with UI

## Table of contents

- [Description](#description)
- [1. Data owners browsing](#data-owners-browsing)
- [2. Data owner creation / data upload](#data-owner-creation)
- [3. Prolongation of the storage term](#how-to-prolong-the-storage-term)
- [4. Data sales browsing](#data-sales-browsing)
- [5. Registration of the wallet](#wallet-registration)

## Description

Data Validator node is an application which is responsible for aggregation and validation of the data from the Data Owners and providing 
it to Prometeus ecosystem. Purpose of the test is to illustrate the work of core functions of Data Validator.

Here you can find the [sequence diagram](https://github.com/Prometeus-Network/prometeus/wiki/Data-Upload-Diagram) illustrates the data upload process and it's actors.

## Data owners browsing

The home screen of Data Validator is the list of Data Owners, previously created by the Data Validator with default wallet (see the default wallet and it's balance in the header). You can choose another default wallet (see list of [registered wallets](#wallet-registration)) with the dropdown control above the Data Owners' grid - to see the the list of Data Owners, asscoiated with that wallet .

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload1.png" alt="1. Data owners browsing">

## Data owner creation

Press 'CREATE NEW DATA OWNER' button in the upper right corner to create new Data Owner asscoiated with the default wallet. First of all, you will must to choose date until which the Data Owner's file will be stored in the System and it's asking price.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload1a.png" alt="2. Data owners creation">

Then you'll be able to add some metadata for the file. We strongly recommend to fill at least 'Brief Description' to make sense for the prospective buyers what this file is about.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload2.png" alt="Metadata">

You can also add a few tags, which will facilitate data browsing on the Data Mart's side. Please press plus button on the right side of the input field to add each tag.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload3.png" alt="Tags">

You can see the list of the successfuly added tags.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload4.png" alt="Tags">

When you entered all the neccesary metadata, please attach the file you'd like to upload and click on 'CREATE DATA OWNER' button.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload5.png" alt="Attach the file">

NOTE: It can take up to few minutes to complete the Data owner creation due to the specificities of the testnet.
You will see the screen below once the task is complete. Close it or create a new Data Owner if you want. You can see the storage price here (amount of PROM tokens were billed for storing the file in the Distributed Data Storage), which is written off from your balance.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/upload6.png" alt="Data Owner created">

You can also see that transaction in our [Prom Blockchain explorer](http://178.62.211.224/).

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/transaction1.png" alt="Transaction">

## How to prolong the storage term

When the Data owner's storage date is about to end, you would like to extend the storage time, because after that date the file will be automatically deleted from the System and cannot be recovered (only way to return the file to the System is to upload it again).
Select the desired date and press 'PROLONG THE TERM'. Storage price will be written off from your balance.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/prolong1.png" alt="Prolong">

NOTE: It can take up to few minutes to complete due to the specificities of the testnet.

## Data Sales Browsing

Here you can see any sales concerning the Data Owners, associated with the current default wallet.

<img src="https://github.com/Prometeus-Network/prometeus/blob/master/docs/sales1.png" alt="">

To see any of the files you have created in the previous steps, you need to go to the [Data Mart UI](http://178.62.207.53:3008), select and purchase any of Data Owner's files (see [testing manual](https://github.com/Prometeus-Network/data-mart-node/blob/master/test.md)). You can select it 






