import { useState } from "react";
import { StaffMember } from "@/utils/appointmentData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface StaffListProps {
  staff: StaffMember[];
  selectedStaff: StaffMember | null;
  onSelectStaff: (staff: StaffMember) => void;
  selectedServiceIds?: number[];
}

const StaffList = ({ staff, selectedStaff, onSelectStaff, selectedServiceIds = [] }: StaffListProps) => {
  // Filter staff members based on selected services (if any)
  const filteredStaff = selectedServiceIds.length === 0
    ? staff
    : staff.filter(member => {
        // For this demo we'll just return all staff members
        // In a real app you would check if the staff member can perform the selected services
        return true;
      });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Выберите мастера</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <Card 
            key={member.id}
            className={`overflow-hidden transition-all hover:shadow-md ${
              selectedStaff?.id === member.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={member.image}
                alt={member.name}
                className="h-48 w-full object-cover object-center"
              />
              {selectedStaff?.id === member.id && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.position}</p>
              <p className="text-sm text-muted-foreground mt-1">Опыт: {member.experience} лет</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {member.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                variant={selectedStaff?.id === member.id ? "default" : "outline"}
                className="w-full"
                onClick={() => onSelectStaff(member)}
              >
                {selectedStaff?.id === member.id ? 'Выбрано' : 'Выбрать'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffList;