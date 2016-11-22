#!/usr/bin/env sh

{

install_chicktech() {
    echo Installing ChicktechWebDevDec2016
    chicktech_dir=$(readlink -f ~/.chicktech)
    if [ -d $chicktech_dir ]; then
        echo Chicktech already exists at $chicktech_dir; remove or back up and try again
        exit 1
    fi

    git clone git@github.com:maxenglander/ChicktechWebDevDec2016 $chicktech_dir
    if [ $? -gt 0 ]; then
        echo Could not clone git@github.com:maxenglander/ChicktechWebDevDec2016
        exit 1
    fi

    . $chicktech_dir/profile
    chicktech install

    unset $chicktech_dir
}

install_git() {
    echo Checking for Git
    if [ $(which git) ]; then
        echo Found Git at $(which git)
    fi
}

install_homebrew() {
    echo Checking for Homebrew
    if [ $(which brew) ]; then
        echo Found Homebrew at $(which brew)
        return
    fi

    echo Installing Homebrew
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
}

install_nodejs() {
    echo Checking for NodeJS
    if [ $(which node) ]; then
        echo Found node at $(which node)
        return
    fi

    install_homebrew

    echo Installing NodeJS
    brew install node
}

install_homebrew
install_nodejs
install_git
install_chicktech

}
