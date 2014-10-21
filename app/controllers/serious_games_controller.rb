require 'net/http' ## Include http lib to enable calling the webservice

class SeriousGamesController < ApplicationController
  # GET /serious_games
  # GET /serious_games.json
  def index
    @serious_games = SeriousGame.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @serious_games }
    end
  end

  # GET /serious_games/1
  # GET /serious_games/1.json
  def show
    @serious_game = SeriousGame.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @serious_game }
    end
  end

  # GET /serious_games/new
  # GET /serious_games/new.json
  def new
    @serious_game = SeriousGame.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @serious_game }
    end
  end

  # GET /serious_games/1/edit
  def edit
    @serious_game = SeriousGame.find(params[:id])
  end

  # POST /serious_games
  # POST /serious_games.json
  def create
    # Getting config file from POST
    config_file = params[:ConfigFile]
    # Preparing the request to the webservice
    url = URI.parse('http://146.191.107.189:8080/seriousgame')
    req = Net::HTTP::Put.new(url.path, initheader = { 'Content-Type' => 'text/plain'})
    req.body = config_file
    # Getting the response
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    # Rendering the response
    if res.code == '200'
      flash[:success] = "Success. Your game ID is : #{res.body}."
      redirect_to action: 'new'
    else 
      flash[:danger] = 'Oups, something went wrong. We could not create the game!'
      redirect_to action: 'new'
    end 
  end

  # PUT /serious_games/1
  # PUT /serious_games/1.json
  def update
    @serious_game = SeriousGame.find(params[:id])

    respond_to do |format|
      if @serious_game.update_attributes(params[:serious_game])
        format.html { redirect_to @serious_game, notice: 'Serious game was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @serious_game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /serious_games/1
  # DELETE /serious_games/1.json
  def destroy
    @serious_game = SeriousGame.find(params[:id])
    @serious_game.destroy

    respond_to do |format|
      format.html { redirect_to serious_games_url }
      format.json { head :no_content }
    end
  end
end