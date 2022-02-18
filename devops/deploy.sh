export SRC_PATH=./devops/

echo "src path: $SRC_PATH"
source $SRC_PATH/.env

export COMMAND=$1;

eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa

case $COMMAND in
    update-testing)
       cd $SRC_PATH

       ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa $SSH_ADDRESS "sudo rm -rf $REMOTE_DIST_TESTING && sudo mkdir -p $REMOTE_DIST_TESTING"

       rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../dist/* $SSH_ADDRESS:$REMOTE_DIST_TESTING
    ;;
    update-branch-stand)
        cd $SRC_PATH;

        BRANCH_NAME=$2;

        DIST_DIR="$STANDS_DIR$BRANCH_NAME-edu-lab";

         ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa $SSH_ADDRESS "sudo rm -rf $DIST_DIR && sudo mkdir -p $DIST_DIR"

         echo "deploy to $SSH_ADDRESS:$DIST_DIR"

         rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../dist/* $SSH_ADDRESS:$DIST_DIR
    ;;
    update-storybook)
      cd $SRC_PATH

      ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa $SSH_ADDRESS "sudo rm -rf $REMOTE_DIST_STORYBOOK && sudo mkdir -p $REMOTE_DIST_STORYBOOK"

      rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../storybook-static/* $SSH_ADDRESS:$REMOTE_DIST_STORYBOOK
    ;;
    update-packages)
        cd $SRC_PATH

        ssh $SSH_ADDRESS -i ~/.ssh/id_rsa "sudo rm -rf $REMOTE_DIST_PACKAGES && sudo mkdir -p $REMOTE_DIST_PACKAGES"

        rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../dist/lessons/* $SSH_ADDRESS:$REMOTE_DIST_PACKAGES

        ssh $SSH_ADDRESS "sudo rm -rf $REMOTE_DIST_ZIPS && sudo mkdir -p $REMOTE_DIST_ZIPS"

        rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../dist/packages/* $SSH_ADDRESS:$REMOTE_DIST_ZIPS

        ssh $SSH_ADDRESS -i ~/.ssh/id_rsa "sudo echo '('`date +"%s.%N"` ' * 1000000)/1' | bc >> $REMOTE_DIST_ZIPS/version.json"
    ;;
   update-package)
        cd $SRC_PATH

        ssh $SSH_ADDRESS -i ~/.ssh/id_rsa "sudo rm -rf $REMOTE_DIST_PACKAGES/$2 && sudo mkdir -p $REMOTE_DIST_PACKAGES/$2"

        rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../dist/lessons/$2/* $SSH_ADDRESS:$REMOTE_DIST_PACKAGES/$2

        ssh $SSH_ADDRESS "sudo rm -rf $REMOTE_DIST_ZIPS && sudo mkdir -p $REMOTE_DIST_ZIPS"

#        rsync -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" --archive ../dist/packages/* $SSH_ADDRESS:$REMOTE_DIST_ZIPS

        ssh $SSH_ADDRESS -i ~/.ssh/id_rsa "sudo echo '('`date +"%s.%N"` ' * 1000000)/1' | bc >> $REMOTE_DIST_ZIPS/version.json"
    ;;
    *)
        echo "no command $COMMAND"
    ;;
esac
