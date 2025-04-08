import { Component, OnInit,ViewChild  } from '@angular/core';
import { User } from '@capacitor-firebase/authentication';
import { MenuController } from '@ionic/angular';
import { FirebaseCommunicationService } from '../services/firebase-communication.service';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

interface PlayerOptions {
    value: string;
    viewValue: string;
  }
  interface Player {
    name: string;
    lp: number;
    cols: string;
    rows: string;
    class: string;
    background: Promise<string>;
    id: number; 
  }

  interface LpHistoryEntry {
    playerName: string;
    playerId: number;
    oldValue: number;
    newValue: number;
    change: number;
    timestamp: Date;
  }

  interface Deck {
    id: string;
    name: string;
    description?: string;
  }

@Component({
  selector: 'app-folder',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {
    @ViewChild(IonModal) modal: IonModal;
    isModalOpen = false;
    isHistoryModalOpen = false;
    isMultiplayerModalOpen = false;
    isShareModalOpen = false;
    isJoinModalOpen = false;
    isDeckModalOpen = false;
    activePlayer: Player | null;
    public players: Player[];
    public playerCount: string;
    public gameStarted: boolean;
    rowHeight: string;
    operator: string;
    value: number;
    updatedValue: number;
    menuVisible: boolean;
    lpHistory: LpHistoryEntry[] = [];
    
    // Timer properties
    timerRunning: boolean = false;
    timerValue: number = 0; 
    timerInterval: any;
    
    // OLED mode properties
    oledModeEnabled: boolean = false;
    oledModeActive: boolean = false;
    oledModeTimeout: any;
    oledModeDelay: number = 10000; // 10 seconds before OLED mode activates
    
    // Multiplayer properties
    gameSessionId: string = '';
    gameIdToJoin: string = '';
    isHost: boolean = false;
    
    // Deck selection
    availableDecks: Deck[] = [
      { id: 'blue-eyes', name: 'Blue-Eyes White Dragon' },
      { id: 'dark-magician', name: 'Dark Magician' },
      { id: 'cyber-dragon', name: 'Cyber Dragon' },
      { id: 'heroes', name: 'Elemental HERO' },
      { id: 'blackwings', name: 'Blackwing' }
    ];
    selectedDeckId: string = 'none';
    selectedDeck: Deck | null = null;
    
    // User info
    currentUser: User | null = null;
  
    public backgroundList: string[]
  
    constructor(
      public fcs: FirebaseCommunicationService,
      public menu: MenuController,
      public asc: ActionSheetController,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController
    ) {
      this.players = []
  
      this.activePlayer = null
  
      this.backgroundList = []
      fcs.listBackgroundImages().then(
        list => {
          console.log(list)
          console.log(list.items.length)
          if (list.items.length != 0) {
            for (let item of list.items) {
              this.backgroundList.push(item.name)
            }
            this.resetGame()
          }
        }
      )
      
      // Set a default player name
      this.currentUser = {
        displayName: 'Player1',
        uid: 'local-player'
      } as User;
  
      this.playerCount = this.playerOptions[0].value
      this.gameStarted = false
      this.rowHeight = "2:1"
  
      this.operator = "-"
      this.value = 0
      this.updatedValue = 0
      this.menuVisible = false
  
    }
    openFirst() {
      this.menu.enable(true, 'menu');
      this.menu.open('menu');
    }
  
    ngOnInit(): void {
    }
    
    updateResult() {
      if (this.activePlayer != null) {
        if (this.operator == "+") {
          this.updatedValue = this.activePlayer.lp + this.value
        }
        else if (this.operator == "-") {
          this.updatedValue = this.activePlayer.lp - this.value
        }
        else if (this.operator == "/") {
          this.updatedValue = Math.ceil(this.activePlayer.lp / this.value)
        }
        if (this.updatedValue < 0) {
          this.updatedValue = 0
        }
      }
    }
  
    playerOptions: PlayerOptions[] = [
      { value: '2', viewValue: 'Zwei' },
      { value: '3-1', viewValue: 'Drei [option 1] -|' },
      { value: '3-2', viewValue: 'Drei  [option 2] ||' },
      { value: '4-1', viewValue: 'Vier' },
      { value: '4-2', viewValue: 'Vier (2 vs. 2)' },
    ];
    
    startGame() {
      this.gameStarted = true
    }
    
    resetValue() {
      this.value = 0
      this.updateResult()
    }
    
    updateValue() {
      this.updateResult();
      
      if (this.activePlayer) {
        // Store the current values before making changes
        const oldValue = this.activePlayer.lp;
        const newValue = this.updatedValue;
        
        // Add to history before changing the value
        const historyEntry: LpHistoryEntry = {
          playerName: this.activePlayer.name,
          playerId: this.activePlayer.id,
          oldValue: oldValue,
          newValue: newValue,
          change: newValue - oldValue,
          timestamp: new Date()
        };
        this.lpHistory.unshift(historyEntry); // Add to beginning of array
        
        // Close the calculator modal first
        this.closeCalc();
        this.setOpen(false);
        
        // Start the animation after closing the modal
        this.animateLifepoints(this.activePlayer, oldValue, newValue);
      }
    }
    
    animateLifepoints(player: Player, startValue: number, endValue: number) {
      // Store the player and values in local variables to avoid reference issues
      const targetPlayer = player;
      const start = startValue;
      const end = endValue;
      const isIncreasing = end > start;
      
      // Calculate animation duration based on the difference
      const difference = Math.abs(end - start);
      const duration = Math.min(Math.max(difference / 20, 500), 2000); // Between 0.5 and 2 seconds
      
      // Calculate step size based on difference
      let stepSize: number;
      if (difference > 5000) stepSize = 500;
      else if (difference > 1000) stepSize = 100;
      else if (difference > 500) stepSize = 50;
      else if (difference > 100) stepSize = 10;
      else stepSize = 1;
      
      // Make sure we're using the right direction
      if (!isIncreasing) stepSize = -stepSize;
      
      // Add a flash effect to the player card
      const playerElement = document.querySelector(`.player-card[id="player-${targetPlayer.id}"]`) as HTMLElement;
      if (playerElement) {
        if (isIncreasing) {
          playerElement.classList.add('lp-increase-flash');
          setTimeout(() => playerElement.classList.remove('lp-increase-flash'), 1000);
        } else {
          playerElement.classList.add('lp-decrease-flash');
          setTimeout(() => playerElement.classList.remove('lp-decrease-flash'), 1000);
        }
      }
      
      // Start animation
      let currentValue = start;
      const animationInterval = setInterval(() => {
        // Update value
        currentValue += stepSize;
        
        // Check if we've reached or passed the target
        if ((stepSize > 0 && currentValue >= end) || (stepSize < 0 && currentValue <= end)) {
          clearInterval(animationInterval);
          targetPlayer.lp = end; // Ensure we end at exactly the target value
        } else {
          targetPlayer.lp = currentValue;
        }
      }, duration / (Math.abs(difference / stepSize)));
    }
    
    toValue(x: number, double = false) {
      if (double) {
        this.value = this.value * 100 + x
      } else {
        this.value = this.value * 10 + x
      }
      this.updateResult()
    }
    
    asOperator(x: string) {
      this.operator = x
      this.updateResult()
    }
    
    divideByTwo() {
      this.operator = "/"
      this.value = 2
      this.updateResult()
    }
    
    getRandomBackground(playerClass: string): Promise<string> {
      return new Promise((resolve, reject) => {
        let index = Math.floor(Math.random() * this.backgroundList.length)
        console.log(index)
        console.log(this.backgroundList[index])
        this.fcs.getBackgroundImageURL(playerClass, this.backgroundList[index]).then(
          url => {
            console.log(url)
            resolve(url)
          }
        )
      })
    }
  
    calcPlayer(player: Player) {
      this.activePlayer = player
    }
    
    closeCalc() {
      this.value = 0
      this.operator = "-"
      this.updateResult()
    }
    
    animateNumbers() {
    }
    
    toggleMenu() {
      this.menuVisible = !this.menuVisible
      console.log(this.menuVisible)
    }
    
    resetGame() {
      this.players = []
      let playerId = 0;
      
      // Set first player name to current user's name if available
      const firstPlayerName = this.currentUser ? this.currentUser.displayName || 'Player1' : 'Player1';
      
      switch (this.playerCount) {
        case '2': {
          this.rowHeight = "1:1"
          this.players.push({ 
            name: firstPlayerName, 
            lp: 8000, 
            cols: "1/1", 
            rows: "1/1", 
            class: "normal", 
            background: this.getRandomBackground("normal"),
            id: playerId++
          })
          this.players.push({ 
            name: "Visitor", 
            lp: 8000, 
            cols: "1/1", 
            rows: "2/2", 
            class: "normal", 
            background: this.getRandomBackground("normal"),
            id: playerId++
          })
          break;
        }
        case '3-1': {
          this.rowHeight = "1:1"
          this.players[0].cols = "1/3"
          this.players[1].cols = "3/7"
          this.players[0].rows = "1/3"
          this.players[1].rows = "1/1"
          this.players[0].class = "r90"
          this.players[1].class = "r180"
          this.players.push({ 
            name: "Player3", 
            lp: 8000, 
            cols: "3/7", 
            rows: "2/2", 
            class: "normal", 
            background: this.getRandomBackground("normal"),
            id: playerId++
          })
          break;
        }
        case '3-2': {
          this.rowHeight = "1:1"
          this.players[0].cols = "1/4"
          this.players[1].cols = "4/7"
          this.players[0].rows = "1/1"
          this.players[1].rows = "1/1"
          this.players[1].class = "r180"
          this.players.push({ 
            name: "Player3", 
            lp: 8000, 
            cols: "1/4", 
            rows: "2/2", 
            class: "normal", 
            background: this.getRandomBackground("normal"),
            id: playerId++
          })
  
          break;
        }
        case '4-1': {
          this.rowHeight = "1:1"
          this.players[0].cols = "1/4"
          this.players[1].cols = "4/7"
          this.players[0].rows = "1/1"
          this.players[1].rows = "1/1"
          this.players[1].class = "r180"
          this.players.push({ 
            name: "Player3", 
            lp: 8000, 
            cols: "1/4", 
            rows: "2/2", 
            class: "normal", 
            background: this.getRandomBackground("normal"),
            id: playerId++
          })
          this.players.push({ 
            name: "Player4", 
            lp: 8000, 
            cols: "4/7", 
            rows: "2/2", 
            class: "normal", 
            background: this.getRandomBackground("normal"),
            id: playerId++
          })
          break;
        }
        case '4-2': {
          this.rowHeight = "1:1"
          this.players[0].name = 'Team1'
          this.players[1].name = 'Team2'
          this.players[0].lp = 16000
          this.players[1].lp = 16000
          break;
        }
      }
      
      this.lpHistory = [];
      
      this.stopTimer();
      this.timerValue = 0;
      
      // Reset multiplayer session
      this.gameSessionId = '';
      this.isHost = false;
      this.selectedDeckId = 'none';
      this.selectedDeck = null;
      
      console.log("this")
      console.log(this.players[0].background)
    }

    // Multiplayer functions
    openMultiplayerModal() {
      this.isMultiplayerModalOpen = true;
    }
    
    closeMultiplayerModal() {
      this.isMultiplayerModalOpen = false;
    }
    
    hostGame() {
      this.closeMultiplayerModal();
      this.isHost = true;
      
      // Generate a random session ID
      this.gameSessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Open deck selection modal
      this.isDeckModalOpen = true;
    }
    
    joinGame() {
      this.closeMultiplayerModal();
      this.isHost = false;
      this.isJoinModalOpen = true;
    }
    
    closeJoinModal() {
      this.isJoinModalOpen = false;
    }
    
    async connectToGame() {
      if (!this.gameIdToJoin) {
        return;
      }
      
      this.gameSessionId = this.gameIdToJoin;
      this.closeJoinModal();
      
      // In a real implementation, this would connect to the host's game
      // For now, we'll just simulate by opening the deck selection
      this.isDeckModalOpen = true;
      
      const toast = await this.toastCtrl.create({
        message: 'Connected to game ' + this.gameSessionId,
        duration: 2000
      });
      toast.present();
    }
    
    openShareModal() {
      this.isShareModalOpen = true;
    }
    
    closeShareModal() {
      this.isShareModalOpen = false;
    }
    
    async copySessionId() {
      // Create a temporary input element
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.gameSessionId;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      
      const toast = await this.toastCtrl.create({
        message: 'Game ID copied to clipboard',
        duration: 2000
      });
      toast.present();
    }
    
    // Deck selection
    openDeckModal() {
      this.isDeckModalOpen = true;
    }
    
    closeDeckModal() {
      this.isDeckModalOpen = false;
    }
    
    confirmDeckSelection() {
      if (this.selectedDeckId !== 'none') {
        this.selectedDeck = this.availableDecks.find(deck => deck.id === this.selectedDeckId) || null;
      } else {
        this.selectedDeck = null;
      }
      
      this.closeDeckModal();
      
      // If hosting, show the share modal
      if (this.isHost) {
        this.openShareModal();
      }
    }
    
    presentActionSheet() {
      // Open multiplayer modal instead of player count action sheet
      this.openMultiplayerModal();
    }
    
    message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
    name: string;
    
    cancel() {
      this.setOpen(false)
    }
    
    confirm() {
      this.setOpen(false)
    }
    
    onWillDismiss(event: Event) {
      this.setOpen(false)
    }

    setOpen(isOpen: boolean) {
      this.isModalOpen = isOpen;
    }
    
    calcLP(player: Player) {
      this.isModalOpen = true;
      this.activePlayer = player;
    }
    
    showHistory() {
      this.isHistoryModalOpen = true;
    }
    
    closeHistoryModal() {
      this.isHistoryModalOpen = false;
    }
    
    undoLastChange() {
      if (this.lpHistory.length > 0) {
        const lastEntry = this.lpHistory[0];
        
        const player = this.players.find(p => p.id === lastEntry.playerId);
        if (player) {
          player.lp = lastEntry.oldValue;
          
          this.lpHistory.shift();
        }
      }
    }
    
    toggleTimer() {
      if (this.timerRunning) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    }
    
    startTimer() {
      this.timerRunning = true;
      this.timerInterval = setInterval(() => {
        this.timerValue++;
        
        // If OLED mode is enabled and not yet active, start the timeout
        if (this.oledModeEnabled && !this.oledModeActive) {
          this.startOledModeTimeout();
        }
      }, 1000);
    }
    
    stopTimer() {
      this.timerRunning = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      
      // If OLED mode is active, deactivate it when timer stops
      if (this.oledModeActive) {
        this.deactivateOledMode();
      }
    }
    
    // OLED mode functions
    toggleOledMode() {
      this.oledModeEnabled = !this.oledModeEnabled;
      
      if (this.oledModeEnabled) {
        // If timer is already running, start the timeout
        if (this.timerRunning) {
          this.startOledModeTimeout();
        }
      } else {
        // If OLED mode is being disabled, deactivate it if active
        if (this.oledModeActive) {
          this.deactivateOledMode();
        }
      }
    }
    
    startOledModeTimeout() {
      // Clear any existing timeout
      if (this.oledModeTimeout) {
        clearTimeout(this.oledModeTimeout);
      }
      
      // Set a new timeout
      this.oledModeTimeout = setTimeout(() => {
        this.activateOledMode();
      }, this.oledModeDelay);
    }
    
    activateOledMode() {
      this.oledModeActive = true;
      document.body.classList.add('oled-mode');
    }
    
    deactivateOledMode() {
      this.oledModeActive = false;
      document.body.classList.remove('oled-mode');
      
      // If OLED mode is still enabled and timer is running, restart the timeout
      if (this.oledModeEnabled && this.timerRunning) {
        this.startOledModeTimeout();
      }
    }
    
    // Touch anywhere to exit OLED mode temporarily
    exitOledModeTemporarily() {
      if (this.oledModeActive) {
        this.deactivateOledMode();
      }
    }
    
    formatTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}