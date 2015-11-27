require 'csv'

class TeachersController < ApplicationController
  filter_resource_access
  filter_access_to :csv, :require => :create
  filter_access_to :createcsv, :require => :create


  # GET /teachers
  # GET /teachers.json
  def index
    @teachers = Teacher.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @teachers }
    end
  end

  # GET /teachers/1
  # GET /teachers/1.json
  def show
    @teacher = Teacher.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @teacher }
    end
  end

  # GET /teachers/new
  # GET /teachers/new.json
  def new
    @teacher = Teacher.new
    @teacher.user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @teacher }
    end
  end


  # GET /teachers/csv
  def csv
    @schools = School.all

    respond_to do |format|
      format.html # csv.html.erb
    end
  end

  # GET /teachers/1/edit
  def edit
    @teacher = Teacher.find(params[:id])
  end

  # POST /teachers
  # POST /teachers.json
  def create
    @teacher = Teacher.new(params[:teacher])
    @teacher.user.role = Role.find_by_title('teacher')
    
    respond_to do |format|
      if @teacher.save
        # give access to tutorial games
        SgTeacher.create(idSG: 131, idTeacher: @teacher.id)
        SgTeacher.create(idSG: 126, idTeacher: @teacher.id)

        # create default groups for teachers
        @groupFrench = Group.create(idTeacher: @teacher.id, name: "French")
        @groupGeo = Group.create(idTeacher: @teacher.id, name: "Geography")
        @groupTeachers = Group.create(idTeacher: @teacher.id, name: "Teachers")

        # associate default students for teachers
        StdTeacher.create(idStd: 11, idTeacher: @teacher.id, idGroup: @groupGeo.id)
        StdTeacher.create(idStd: 12, idTeacher: @teacher.id, idGroup: @groupGeo.id)
        StdTeacher.create(idStd: 14, idTeacher: @teacher.id, idGroup: @groupFrench.id)
        StdTeacher.create(idStd: 15, idTeacher: @teacher.id, idGroup: @groupFrench.id)

        format.html { redirect_to login_path, notice: 'Teacher was successfully created.' }
        format.json { render json: @teacher, status: :created, location: @teacher }
      else
        format.html { render action: "new" }
        format.json { render json: @teacher.errors, status: :unprocessable_entity }
      end
    end
  end


  # POST /teachers
  # POST /teachers.json
  def createcsv

    @schools = School.all
    errors = "";
    
    CSV.foreach(params[:file].path, headers: true) do |row|
      p = "password"
      passwd = row.to_hash[p.to_sym]

      # create the teacher account
      @teacher = Teacher.new
      @teacher.user = User.new(row.to_hash)
      @teacher.user.password_confirmation = passwd
      @teacher.user.role = Role.find_by_title('teacher')
      @teacher.idSchool = params[:idSchool]

      if @teacher.save

        # create default groups for teachers
        @groupTeachers = Group.create(idTeacher: @teacher.id, name: "Teachers")

        # create a student account for the teacher
        @student = Student.new
        @student.username = @teacher.user.username
        @student.password = @teacher.user.username
        @student.idSchool = @teacher.idSchool 
        @student.idGroup = @groupTeachers.id
        @student.save

        if @student.save
          StdTeacher.create!(idStd: @student.id, idTeacher: @teacher.id, idGroup: @student.idGroup)
        else
          errors = "{error: 'error while creating student/teacher association'}"
        end
      else
        errors = "{error: 'error while creating teacher account'}"
      end
    end
    
    respond_to do |format|
      if errors == ""
        format.html { redirect_to teachers_path, notice: 'Teachers successfully created.' }
      else
        format.html { render action: "csv" }
        format.json { render json: errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /teachers/1
  # PUT /teachers/1.json
  def update
    @teacher = Teacher.find(params[:id])

    respond_to do |format|
      if @teacher.update_attributes(params[:teacher])
        format.html { redirect_to @teacher, notice: 'Teacher was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @teacher.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /teachers/1
  # DELETE /teachers/1.json
  def destroy
    @teacher = Teacher.find(params[:id])
    @teacher.destroy

    respond_to do |format|
      format.html { redirect_to teachers_url }
      format.json { head :no_content }
    end
  end
end
