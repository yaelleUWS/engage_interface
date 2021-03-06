class School < ActiveRecord::Base
  has_many :teachers, :foreign_key => :idSchool
  has_many :students, :foreign_key => :idSchool

  has_many :sg_school, :foreign_key => :idSchool
  has_many :serious_games, through: :sg_school, :foreign_key => :idSchool

  attr_accessible :name, :country, :city

  self.table_name = "school"
end
