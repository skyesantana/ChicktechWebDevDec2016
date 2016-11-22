#!/usr/bin/env sh

{

chicktech_install_git() {
    echo Checking for Git
    if [ $(which git) ]; then
        echo Found Git at $(which git)
    fi
}

chicktech_install_homebrew() {
    echo Checking for Homebrew
    if [ $(which brew) ]; then
        echo Found Homebrew at $(which brew)
        return
    fi

    echo Installing Homebrew
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
}

chicktech_install_nodejs() {
    echo Checking for NodeJS
    if [ $(which node) ]; then
        echo Found node at $(which node)
        return
    fi

    install_homebrew

    echo Installing NodeJS
    brew install node
}

chicktech() {
    if [ $# -lt 1 ]; then
        chicktech help
        return
    fi

    case $1 in
        "help")
            echo
            echo 'Usage:'
            echo '    chicktech help                                               Show this message'
            echo '    chicktech home                                               Go to the Chicktech home dir'
            echo
            ;;
    esac
}

}
