#!/usr/bin/env bash

{ # this ensures the entire script is downloaded #

chicktech_has() {
  type "$1" > /dev/null 2>&1
}

if [ -z "$CHICKTECH_DIR" ]; then
  CHICKTECH_DIR="$HOME/.chicktech"
fi

chicktech_latest_version() {
  echo "master"
}

#
# Outputs the location to CHICKTECH depending on:
# * The availability of $CHICKTECH_SOURCE
# * The method used ("script" or "git" in the script, defaults to "git")
# CHICKTECH_SOURCE always takes precedence unless the method is "script-chicktech-exec"
#
chicktech_source() {
  local CHICKTECH_METHOD
  CHICKTECH_METHOD="$1"
  local CHICKTECH_SOURCE_URL
  CHICKTECH_SOURCE_URL="$CHICKTECH_SOURCE"
  if [ -z "$CHICKTECH_SOURCE_URL" ]; then
    if [ "_$CHICKTECH_METHOD" = "_script" ]; then
      CHICKTECH_SOURCE_URL="https://raw.githubusercontent.com/maxenglander/ChicktechWebDevDec2016/$(chicktech_latest_version)/chicktech.sh"
    elif [ "_$CHICKTECH_METHOD" = "_git" ] || [ -z "$CHICKTECH_METHOD" ]; then
      CHICKTECH_SOURCE_URL="git@github.com:maxenglander/ChicktechWebDevDec2016.git"
    else
      echo >&2 "Unexpected value \"$CHICKTECH_METHOD\" for \$CHICKTECH_METHOD"
      return 1
    fi
  fi
  echo "$CHICKTECH_SOURCE_URL"
}

chicktech_download() {
  if chicktech_has "curl"; then
    curl -q $*
  elif chicktech_has "wget"; then
    # Emulate curl with wget
    ARGS=$(echo "$*" | command sed -e 's/--progress-bar /--progress=bar /' \
                           -e 's/-L //' \
                           -e 's/-I /--server-response /' \
                           -e 's/-s /-q /' \
                           -e 's/-o /-O /' \
                           -e 's/-C - /-c /')
    wget $ARGS
  fi
}

install_chicktech_from_git() {
  if [ -d "$CHICKTECH_DIR/.git" ]; then
    echo "=> chicktech is already installed in $CHICKTECH_DIR, trying to update using git"
    printf "\r=> "
    cd "$CHICKTECH_DIR" && (command git fetch 2> /dev/null || {
      echo >&2 "Failed to update chicktech, run 'git fetch' in $CHICKTECH_DIR yourself." && exit 1
    })
  else
    # Cloning to $CHICKTECH_DIR
    echo "=> Downloading chicktech from git to '$CHICKTECH_DIR'"
    printf "\r=> "
    mkdir -p "$CHICKTECH_DIR"
    (command git clone --recursive "$(chicktech_source git)" "$CHICKTECH_DIR" 2> /dev/null || {
      echo >&2 "Failed to update chicktech, run 'git clone $(chicktech_source git) $CHICKTECH_DIR' yourself." && exit 1
    })
  fi
  cd "$CHICKTECH_DIR" && command git checkout --quiet "$(chicktech_latest_version)"
  if [ ! -z "$(cd "$CHICKTECH_DIR" && git show-ref refs/heads/master)" ]; then
    if git branch --quiet 2>/dev/null; then
      cd "$CHICKTECH_DIR" && command git branch --quiet -D master >/dev/null 2>&1
    else
      echo >&2 "Your version of git is out of date. Please update it!"
      cd "$CHICKTECH_DIR" && command git branch -D master >/dev/null 2>&1
    fi
  fi
  return
}

install_chicktech_as_script() {
  local CHICKTECH_SOURCE_LOCAL
  CHICKTECH_SOURCE_LOCAL=$(chicktech_source script)
  local CHICKTECH_EXEC_SOURCE
  CHICKTECH_EXEC_SOURCE=$(chicktech_source script-chicktech-exec)

  # Downloading to $CHICKTECH_DIR
  mkdir -p "$CHICKTECH_DIR"
  if [ -f "$CHICKTECH_DIR/chicktech.sh" ]; then
    echo "=> chicktech is already installed in $CHICKTECH_DIR, trying to update the script"
  else
    echo "=> Downloading chicktech as script to '$CHICKTECH_DIR'"
  fi
  chicktech_download -s "$CHICKTECH_SOURCE_LOCAL" -o "$CHICKTECH_DIR/chicktech.sh" || {
    echo >&2 "Failed to download '$CHICKTECH_SOURCE_LOCAL'"
    return 1
  }
}

#
# Detect profile file if not specified as environment variable
# (eg: PROFILE=~/.myprofile)
# The echo'ed path is guaranteed to be an existing file
# Otherwise, an empty string is returned
#
chicktech_detect_profile() {
  if [ -n "$PROFILE" -a -f "$PROFILE" ]; then
    echo "$PROFILE"
    return
  fi

  local DETECTED_PROFILE
  DETECTED_PROFILE=''
  local SHELLTYPE
  SHELLTYPE="$(basename "/$SHELL")"

  if [ "$SHELLTYPE" = "bash" ]; then
    if [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    fi
  elif [ "$SHELLTYPE" = "zsh" ]; then
    DETECTED_PROFILE="$HOME/.zshrc"
  fi

  if [ -z "$DETECTED_PROFILE" ]; then
    if [ -f "$HOME/.profile" ]; then
      DETECTED_PROFILE="$HOME/.profile"
    elif [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    elif [ -f "$HOME/.zshrc" ]; then
      DETECTED_PROFILE="$HOME/.zshrc"
    fi
  fi

  if [ ! -z "$DETECTED_PROFILE" ]; then
    echo "$DETECTED_PROFILE"
  fi
}

chicktech_do_install() {
  if [ -z "$METHOD" ]; then
    # Autodetect install method
    if chicktech_has "git"; then
      install_chicktech_from_git
    elif chicktech_has "chicktech_download"; then
      install_chicktech_as_script
    else
      echo >&2 "You need git, curl, or wget to install chicktech"
      exit 1
    fi
  elif [ "~$METHOD" = "~git" ]; then
    if ! chicktech_has "git"; then
      echo >&2 "You need git to install chicktech"
      exit 1
    fi
    install_chicktech_from_git
  elif [ "~$METHOD" = "~script" ]; then
    if ! chicktech_has "chicktech_download"; then
      echo >&2 "You need curl or wget to install chicktech"
      exit 1
    fi
    install_chicktech_as_script
  fi

  echo

  local CHICKTECH_PROFILE
  CHICKTECH_PROFILE=$(chicktech_detect_profile)

  SOURCE_STR="\nexport CHICKTECH_DIR=\"$CHICKTECH_DIR\"\n[ -s \"\$CHICKTECH_DIR/chicktech.sh\" ] && . \"\$CHICKTECH_DIR/chicktech.sh\"  # This loads chicktech"

  if [ -z "$CHICKTECH_PROFILE" ] ; then
    echo "=> Profile not found. Tried $CHICKTECH_PROFILE (as defined in \$PROFILE), ~/.bashrc, ~/.bash_profile, ~/.zshrc, and ~/.profile."
    echo "=> Create one of them and run this script again"
    echo "=> Create it (touch $CHICKTECH_PROFILE) and run this script again"
    echo "   OR"
    echo "=> Append the following lines to the correct file yourself:"
    printf "$SOURCE_STR"
    echo
  else
    if ! command grep -qc '/chicktech.sh' "$CHICKTECH_PROFILE"; then
      echo "=> Appending source string to $CHICKTECH_PROFILE"
      printf "$SOURCE_STR\n" >> "$CHICKTECH_PROFILE"
    else
      echo "=> Source string already in $CHICKTECH_PROFILE"
    fi
  fi

  . $CHICKTECH_DIR/chicktech.sh
  chicktech_unset
}

#
# Unsets the various functions defined
# during the execution of the install script
#
chicktech_unset() {
  unset -f chicktech_reset chicktech_has chicktech_latest_version \
    chicktech_source chicktech_download install_chicktech_as_script install_chicktech_from_git \
    chicktech_detect_profile chicktech_check_global_modules chicktech_do_install
}

[ "_$CHICKTECH_ENV" = "_testing" ] || chicktech_do_install

} # this ensures the entire script is downloaded #
