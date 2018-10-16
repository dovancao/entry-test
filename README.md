# EOS

## System requirements (all platforms)

  + 7GB RAM free required
  + 20GB Disk free required

###### Table of Contents
1.[Install On Ubuntu - Linux](#ubuntu)
2.[Install On MacOs Siera 10.12 and higher](#macosx)
3.[Install On Centos 7 and higher](#centos)


## Install On Ubuntu - Linux <a name="ubuntu">

#### Install
**Step 1**: Download Docker
[Docker help](https://www.docker.com/get-started) you to get started as quickly as possible. This is the best option at the moment

**Step 2**: Get Docket image

```
  $ docker pull eosio/eos
```

#### Setup
**Step 1**: Boot node and Wallet

In the last step you created a `contracts` directory, obtained the absolute path. Replace both occurrences of "CONTRACTS_DIR" in the command below with the absolute path to your `contracts` directory.

```
  $ docker run --name eosio \
  --publish 7777:7777 \
  --publish 127.0.0.1:5555:5555 \
  --volume {pwd}:/CONTRACTS_DIR \
  --detach \
  eosio/eos \
  /bin/bash -c \
  "keosd --http-server-address=0.0.0.0:5555 & exec nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::history_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --plugin eosio::http_plugin -d /mnt/dev/data --config-dir /mnt/dev/config --http-server-address=0.0.0.0:7777 --access-control-allow-origin=* --contracts-console --http-validate-host=false --filter-on='*'"
```

**Step 2**: Check your installation
Run the following Command
``` 
  $ docker logs --tail 10 eosio
```

#### Run and Config
###### Create development wallet
**Step 1**: Open Shell
```
   docker exec -it eosio bash
```

**Step 2**: Type in Shell
```
  cleos --wallet-url http://127.0.0.1:5555 wallet create --to-console
```
 A password will be generate instantly. Remember to coppy it.

**Step 3**: Open and unlock wallet
```
  cleos --wallet-url http://127.0.0.1:5555 wallet open
  cleos --wallet-url http://127.0.0.1:5555 wallet unlock
```

You will be prompted for your password, paste it and press enter. (Your password is created above)

**Step 4**: Create public key for wallet
```
  cleos --wallet-url http://127.0.0.1:5555 wallet create_key
```
A public key will be generated. Remeber to coppy it

**Step 5**: Import development key (private key)
```
   cleos --wallet-url http://127.0.0.1:5555 wallet import
```
You'll be prompted for a private key, enter the eosio development key provided below
```
  5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

**Step 6**: Create 'user' account
Use public key to create user account. Type this command in Shell
```
  cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555 create account eosio NAME_OF_ACCOUNT PUBLIC_KEY
```

Then you should then see a confirmation message similar to the following for each command that confirms that the transaction has been broadcast.

```
  executed transaction: c33672d210a2913af75c9e1bd966113a0c55251e70273275ffd0a970ed19b011  200 bytes  541 us
    #         eosio <= eosio::newaccount            {"creator":"eosio","name":"sondophuc","owner":{"threshold":1,"keys":      [{  "key":"EOS7keDvdtm43FcBdttmdCU...
```

###### Build the contract development toolkit
The EOSIO Contract Development Toolkit, CDT for short, is a collection of tools related to contract compilation. 
The location where eosio.cdt is cloned is not that important because you will be installing eosio.cdt as a local binary in later steps. For now, you can clone eosio.cdt to your "contracts" directory previously created, or really anywhere else on your local system you see fit.

**Step 1**:
```
  cd CONTRACT_DIR
```
Clone the eosio.cdt repository
```
  git clone --recursive https://github.com/eosio/eosio.cdt
cd eosio.cdt
```
**Step 2**: Build
```
  ./build.sh SYS
```

**Step 3**: Install
```
  $ sudo ./instal.sh
```

*If you cannot complete install*
**Step 1**: Open Shell
```
  docker exec -it eosio bash
```

**Step 2**: Add the following to your profile file appropriate to your system: On linux, this is often: ~/.bash_rc, and on Mac OS, this is: ~/.profile
```
  alias eosio-cpp="/path/to/eosio-cpp"
```
------------------------------------------------------------------------------------------------
<a name='macosx'/>
## Install On MacOs Siera 10.12 and higher

#### Setup enviroment

MacOS additional Dependencies
+ Brew
+ Newest Xcode
+ MongoDB C++ driver

#### Install
**1**. Upgrade your XCode to the newest version
```
  $ xcode-select --install
```
**2**. Install homebrew
```
  $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**3**. Install the dependencies
```
  $ brew update
  $ brew install git automake libtool cmake boost openssl@1.0 llvm@4 gmp ninja gettext mongodb
  $ brew link gettext --force
```

**4**. Install mongo-cxx-driver (release/stable)
```
  cd ~
  $ brew install --force pkgconfig
  $ brew unlink pkgconfig && brew link --force pkgconfig
  $ curl -LO https://github.com/mongodb/mongo-c-driver/releases/download/1.9.3/mongo-c-driver-1.9.3.tar.gz
  $ tar xf mongo-c-driver-1.9.3.tar.gz
  $ rm -f mongo-c-driver-1.9.3.tar.gz
  $ cd mongo-c-driver-1.9.3
  $ ./configure --enable-static --enable-ssl=darwin --disable-automatic-init-and-cleanup --prefix=/usr/local
  $ make -j$( sysctl -in machdep.cpu.core_count )
  $ sudo make install
  $ cd ..
  $ rm -rf mongo-c-driver-1.9.3

  $ git clone https://github.com/mongodb/mongo-cxx-driver.git --branch releases/v3.2 --depth 1
  $ cd mongo-cxx-driver/build
  $ cmake -DBUILD_SHARED_LIBS=OFF -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local ..
  $ make -j$( sysctl -in machdep.cpu.core_count )
  $ sudo make install
  $ cd ..
  $ rm -rf mongo-cxx-driver
```

**5**. Install secp256k1-zkp (Cryptonomex branch):

```
  $ cd ~
  $ git clone https://github.com/cryptonomex/secp256k1-zkp.git
  $ cd secp256k1-zkp
  $ ./autogen.sh
  $ ./configure
  $ make -j$( sysctl -in machdep.cpu.core_count )
  $ sudo make install
```

**6**. Build LLVM and clang for WASM
```
  $ mkdir  ~/wasm-compiler
  $ cd ~/wasm-compiler
  $ git clone --depth 1 --single-branch --branch release_40 https://github.com/llvm-mirror/llvm.git
  $ cd llvm/tools
  $ git clone --depth 1 --single-branch --branch release_40 https://github.com/llvm-mirror/clang.git
  $ cd ..
  $ mkdir build
  $ cd build
  $ cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=.. -DLLVM_TARGETS_TO_BUILD=      -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly -DCMAKE_BUILD_TYPE=Release ../
  $ make -j$( sysctl -in machdep.cpu.core_count )
  $ make install
```

#### Build

```
  $ cmake -DBINARYEN_BIN=~/binaryen/bin -DWASM_ROOT=/usr/local/wasm -DOPENSSL_ROOT_DIR=/usr/local/opt/openssl -DOPENSSL_LIBRARIES=/usr/local/opt/openssl/lib -DBUILD_MONGO_DB_PLUGIN=true ..
```

Then
```
  $ make -j$( nproc )
```

#### Make Install
For ease of contract development, content can be installed in the /usr/local folder using the `make install` target. This step is run from the build `folder`. Adequate permission is required to install.

```
  ./eosio_install.sh
```

--------------------------------------------------------------------------------------------------
<a name='centos'/>
## Install On Centos 7 and higher

#### Setup enviroment
Install the development toolkit
+ Installation on Centos requires installing/enabling the Centos Software Collections

```
  # sudo yum --enablerepo=extras install centos-release-scl
  # sudo yum update
  # sudo yum install -y devtoolset-7
  # scl enable devtoolset-7 bash
  # sudo yum install -y python33.x86_64
  # scl enable python33 bash
  # sudo yum install git autoconf automake libtool make bzip2 \
                 bzip2-devel.x86_64 openssl-devel.x86_64 gmp-devel.x86_64 \
                 ocaml.x86_64 doxygen libicu-devel.x86_64 python-devel.x86_64 \
                 gettext-devel.x86_64
```
+ Install CMake 3.10.2

```
  # cd ~
  # curl -L -O https://cmake.org/files/v3.10/cmake-3.10.2.tar.gz
  # tar xf cmake-3.10.2.tar.gz
  # cd cmake-3.10.2
  # ./bootstrap
  # make -j$( nproc )
  # sudo make install
```

+ Install Boost 1.66

```
  # cd ~
  # curl -L https://dl.bintray.com/boostorg/release/1.66.0/source/boost_1_66_0.tar.bz2 > boost_1.66.0.tar.bz2
  # tar xf boost_1.66.0.tar.bz2
  # echo "export BOOST_ROOT=$HOME/boost_1_66_0" >> ~/.bash_profile
  # source ~/.bash_profile
  # cd boost_1_66_0/
  # ./bootstrap.sh "--prefix=$BOOST_ROOT"
  # ./b2 install
```

+ Install MongoDB (mongodb.org)

```
  # mkdir ${HOME}/opt
  # cd ${HOME}/opt
  # curl -OL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-amazon-3.6.3.tgz
  # tar xf mongodb-linux-x86_64-amazon-3.6.3.tgz
  # rm -f mongodb-linux-x86_64-amazon-3.6.3.tgz
  # ln -s ${HOME}/opt/mongodb-linux-x86_64-amazon-3.6.3/ ${HOME}/opt/mongodb
  # mkdir ${HOME}/opt/mongodb/data
  # mkdir ${HOME}/opt/mongodb/log
  # touch ${HOME}/opt/mongodb/log/mongod.log

  # tee > /dev/null ${HOME}/opt/mongodb/mongod.conf <<mongodconf
  # systemLog:
      destination: file
      path: ${HOME}/opt/mongodb/log/mongod.log
      logAppend: true
      logRotate: reopen
  # net:
      bindIp: 127.0.0.1,::1
      ipv6: true
  # storage:
      dbPath: ${HOME}/opt/mongodb/data
  # mongodconf

  # export PATH=${HOME}/opt/mongodb/bin:$PATH
  # mongod -f ${HOME}/opt/mongodb/mongod.conf
```

+ Install mongo-cxx-driver (release/stable):

```
  # cd ~
  # git clone https://github.com/cryptonomex/secp256k1-zkp.git
  # cd secp256k1-zkp
  # ./autogen.sh
  # ./configure
  # make -j$( nproc )
  # sudo make install
```

+ By default LLVM and clang do not include the WASM build target, so you will have to build it yourself:

```
  # mkdir  ~/wasm-compiler
  # cd ~/wasm-compiler
  # git clone --depth 1 --single-branch --branch release_40 https://github.com/llvm-mirror/llvm.git
  # cd llvm/tools
  # git clone --depth 1 --single-branch --branch release_40 https://github.com/llvm-mirror/clang.git  
  # cd ..
  # mkdir build
  # cd build
  # cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=.. -DLLVM_TARGETS_TO_BUILD=      -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly 
  -DLLVM_ENABLE_RTTI=1 -DCMAKE_BUILD_TYPE=Release ../
  # make -j$( nproc ) 
  # make install
```
